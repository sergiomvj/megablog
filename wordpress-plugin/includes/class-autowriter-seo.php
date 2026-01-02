<?php

class AutoWriter_SEO {

    public function detect_provider() {
        if (defined('WPSEO_VERSION')) {
            return 'yoast';
        } elseif (defined('RANK_MATH_VERSION')) {
            return 'rankmath';
        }
        return 'none';
    }

    public function apply_seo($post_id, $seo_data) {
        $provider = $this->detect_provider();

        if ($provider === 'yoast') {
            update_post_meta($post_id, '_yoast_wpseo_title', $seo_data['meta_title']);
            update_post_meta($post_id, '_yoast_wpseo_metadesc', $seo_data['meta_description']);
            update_post_meta($post_id, '_yoast_wpseo_focuskw', $seo_data['focus_keyword']);
        } elseif ($provider === 'rankmath') {
            update_post_meta($post_id, 'rank_math_title', $seo_data['meta_title']);
            update_post_meta($post_id, 'rank_math_description', $seo_data['meta_description']);
            update_post_meta($post_id, 'rank_math_focus_keyword', $seo_data['focus_keyword']);
        }

        // Generic fallback or basic meta if needed
        update_post_meta($post_id, '_autowriter_seo_applied', current_time('mysql'));
    }
}
