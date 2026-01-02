<?php

class AutoWriter_Media {

    public function sideload_image($image_data, $post_id) {
        $url = $image_data['url'];
        
        if (!$this->validate_url($url)) {
            return null;
        }

        require_once(ABSPATH . 'wp-admin/includes/media.php');
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');

        // Download the image
        $tmp = download_url($url);

        if (is_wp_error($tmp)) {
            return null;
        }

        $file_array = [
            'name'     => basename($url),
            'tmp_name' => $tmp,
        ];

        // Check file type
        $file_type = wp_check_filetype($file_array['name'], null);
        if (!in_array($file_type['type'], ['image/jpeg', 'image/png', 'image/webp'])) {
            @unlink($tmp);
            return null;
        }

        $id = media_handle_sideload($file_array, $post_id, $image_data['alt'] ?? '');

        if (is_wp_error($id)) {
            @unlink($tmp);
            return null;
        }

        return $id;
    }

    private function validate_url($url) {
        // SSRF Protection
        if (strpos($url, 'https://') !== 0) {
            return false;
        }

        $parsed_url = parse_url($url);
        $host = $parsed_url['host'];

        // Block local/private IPs
        $ip = gethostbyname($host);
        if ($this->is_private_ip($ip)) {
            return false;
        }

        return true;
    }

    private function is_private_ip($ip) {
        $pri_addrs = [
            '10.0.0.0|10.255.255.255',
            '172.16.0.0|172.31.255.255',
            '192.168.0.0|192.168.255.255',
            '169.254.0.0|169.254.255.255',
            '127.0.0.0|127.255.255.255'
        ];

        $long_ip = ip2long($ip);
        if ($long_ip === false) return true; // Invalid IP or could not resolve

        foreach ($pri_addrs as $pri_addr) {
            list($start, $end) = explode('|', $pri_addr);
            if ($long_ip >= ip2long($start) && $long_ip <= ip2long($end)) {
                return true;
            }
        }

        return false;
    }
}
