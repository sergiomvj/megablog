<?php

class AutoWriter_Security {

    public function validate_request($request) {
        $settings = get_site_option('autowriter_settings');
        
        if (empty($settings['hmac_secret'])) {
            return true; // HMAC not configured, fallback to default auth
        }

        $timestamp = $request->get_header('X-AW-Timestamp');
        $signature = $request->get_header('X-AW-Signature');

        if (!$timestamp || !$signature) {
            return false;
        }

        // Window of 5 minutes
        if (abs(time() - (int)$timestamp) > 300) {
            return false;
        }

        $body = $request->get_body();
        $expected_signature = hash_hmac('sha256', $timestamp . $body, $settings['hmac_secret']);

        return hash_equals($expected_signature, $signature);
    }
}
