<?php

class AutoWriter_Admin_Network {

    public function init() {
        add_action('network_admin_menu', [$this, 'add_menu']);
    }

    public function add_menu() {
        add_menu_page(
            'AutoWriter',
            'AutoWriter',
            'manage_network',
            'autowriter',
            [$this, 'render_settings_page'],
            'dashicons-edit-page'
        );
        
        add_submenu_page(
            'autowriter',
            'Settings',
            'Settings',
            'manage_network',
            'autowriter-settings',
            [$this, 'render_settings_page']
        );

        add_submenu_page(
            'autowriter',
            'Jobs Monitor',
            'Jobs Monitor',
            'manage_network',
            'autowriter-jobs',
            [$this, 'render_jobs_page']
        );
    }

    public function render_settings_page() {
        if (isset($_POST['autowriter_save_settings'])) {
            check_admin_referer('autowriter_settings_action');
            
            $new_settings = [
                'auth_mode' => sanitize_text_field($_POST['auth_mode']),
                'hmac_secret' => sanitize_text_field($_POST['hmac_secret']),
                'default_post_status' => sanitize_text_field($_POST['default_post_status']),
                'image_mode' => sanitize_text_field($_POST['image_mode']),
                'logging_level' => sanitize_text_field($_POST['logging_level']),
                'auto_create_category' => isset($_POST['auto_create_category']) ? 'yes' : 'no',
            ];
            
            update_site_option('autowriter_settings', $new_settings);
            echo '<div class="notice notice-success is-dismissible"><p>Configurações salvas com sucesso.</p></div>';
        }

        $settings = get_site_option('autowriter_settings');
        $health = $this->get_system_health();
        ?>
        <div class="wrap">
            <h1>AutoWriter Central Settings</h1>
            
            <div id="dashboard-widgets-wrap">
                <div id="dashboard-widgets" class="metabox-holder">
                    <div class="postbox-container" style="width: 100%;">
                        <div class="postbox">
                            <h2 class="hndle"><span>Saúde do Sistema (System Health)</span></h2>
                            <div class="inside">
                                <ul style="margin: 0;">
                                    <?php foreach ($health as $item): ?>
                                    <li style="margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                                        <span class="dashicons <?php echo $item['status'] === 'ok' ? 'dashicons-yes text-success' : 'dashicons-warning text-error'; ?>" 
                                              style="color: <?php echo $item['status'] === 'ok' ? '#46b450' : '#dc3232'; ?>"></span>
                                        <strong><?php echo esc_html($item['label']); ?>:</strong>
                                        <span><?php echo esc_html($item['message']); ?></span>
                                    </li>
                                    <?php endforeach; ?>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <form method="post">
                <?php wp_nonce_field('autowriter_settings_action'); ?>
                <div class="card" style="max-width: 100%; margin-top: 20px;">
                    <h2>Conectividade e Segurança</h2>
                    <table class="form-table">
                        <tr>
                            <th>Modo de Autenticação</th>
                            <td>
                                <select name="auth_mode" class="regular-text">
                                    <option value="application_password" <?php selected($settings['auth_mode'], 'application_password'); ?>>Apenas Application Password</option>
                                    <option value="hmac" <?php selected($settings['auth_mode'], 'hmac'); ?>>Application Password + Assinatura HMAC (Recomendado)</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>Segredo HMAC (HMAC Secret)</th>
                            <td>
                                <input type="password" name="hmac_secret" value="<?php echo esc_attr($settings['hmac_secret']); ?>" class="large-text" style="font-family: monospace;">
                                <p class="description">Este segredo deve ser configurado no painel central para assinar as requisições.</p>
                            </td>
                        </tr>
                    </table>

                    <h2>Padrões de Conteúdo</h2>
                    <table class="form-table">
                        <tr>
                            <th>Status Padrão do Post</th>
                            <td>
                                <select name="default_post_status">
                                    <option value="draft" <?php selected($settings['default_post_status'], 'draft'); ?>>Rascunho (Draft)</option>
                                    <option value="publish" <?php selected($settings['default_post_status'], 'publish'); ?>>Publicado</option>
                                    <option value="pending" <?php selected($settings['default_post_status'], 'pending'); ?>>Pendente</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>Criação de Termos</th>
                            <td>
                                <label>
                                    <input type="checkbox" name="auto_create_category" value="yes" <?php checked($settings['auto_create_category'] ?? 'yes', 'yes'); ?>>
                                    Criar categorias e tags automaticamente se não existirem.
                                </label>
                            </td>
                        </tr>
                    </table>
                </div>

                <p class="submit">
                    <input type="submit" name="autowriter_save_settings" class="button-primary button-large" value="Salvar Todas as Configurações">
                </p>
            </form>
        </div>
        <style>
            .text-success { color: #46b450; }
            .text-error { color: #dc3232; }
            .badge { padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; text-transform: uppercase; }
            .badge-success { background: #e7f5ea; color: #1e7d34; }
            .badge-warning { background: #fcf4e8; color: #855d10; }
            .badge-error { background: #fbeae5; color: #b32d2e; }
        </style>
        <?php
    }

    private function get_system_health() {
        return [
            [
                'label' => 'Multisite',
                'status' => is_multisite() ? 'ok' : 'error',
                'message' => is_multisite() ? 'Habilitado' : 'Desabilitado (Obrigatório)',
            ],
            [
                'label' => 'Extensão JSON',
                'status' => function_exists('json_decode') ? 'ok' : 'error',
                'message' => function_exists('json_decode') ? 'Habilitada' : 'Faltando',
            ],
            [
                'label' => 'Permissões de Upload',
                'status' => wp_is_writable(wp_upload_dir()['basedir']) ? 'ok' : 'error',
                'message' => wp_is_writable(wp_upload_dir()['basedir']) ? 'Escrita permitida' : 'Sem permissão de escrita',
            ],
            [
                'label' => 'Versão do PHP',
                'status' => version_compare(PHP_VERSION, '7.4', '>=') ? 'ok' : 'warning',
                'message' => PHP_VERSION,
            ],
        ];
    }

    public function render_jobs_page() {
        global $wpdb;
        $table_name = $wpdb->base_prefix . 'autowriter_jobs';
        $jobs = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC LIMIT 50");
        ?>
        <div class="wrap">
            <h1>Monitor de Trabalhos (Jobs Monitor)</h1>
            <p>Abaixo estão os últimos 50 artigos processados pelo sistema central.</p>
            
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th style="width: 15%;">ID Externo</th>
                        <th>Blog Name</th>
                        <th style="width: 12%;">Status</th>
                        <th>Ver Post</th>
                        <th>Métricas</th>
                        <th style="width: 15%;">Data</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($jobs)): ?>
                        <tr><td colspan="6">Nenhum trabalho encontrado ainda.</td></tr>
                    <?php endif; ?>

                    <?php foreach ($jobs as $job): 
                        $badge_class = 'badge-warning';
                        if ($job->status === 'completed') $badge_class = 'badge-success';
                        if ($job->status === 'failed') $badge_class = 'badge-error';
                        
                        $blog_details = get_blog_details($job->blog_id);
                        ?>
                    <tr>
                        <td><code><?php echo esc_html($job->external_job_id); ?></code></td>
                        <td>
                            <strong><?php echo $blog_details ? esc_html($blog_details->blogname) : 'Blog #'.$job->blog_id; ?></strong>
                            <br><small>ID: <?php echo $job->blog_id; ?></small>
                        </td>
                        <td>
                            <span class="badge <?php echo $badge_class; ?>">
                                <?php echo esc_html($job->status); ?>
                            </span>
                        </td>
                        <td>
                            <?php if ($job->post_id): ?>
                                <a href="<?php echo get_edit_post_link($job->post_id, 'display', $job->blog_id); ?>" class="button button-small" target="_blank">Ver Artigo</a>
                            <?php else: ?>
                                -
                            <?php endif; ?>
                        </td>
                        <td>
                            <?php if ($job->actual_ms): ?>
                                <small>⏱ <?php echo round($job->actual_ms / 1000, 1); ?>s</small>
                            <?php endif; ?>
                        </td>
                        <td><?php echo esc_html(date_i18n(get_option('date_format') . ' ' . get_option('time_format'), strtotime($job->created_at))); ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <style>
            .badge { padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; text-transform: uppercase; }
            .badge-success { background: #e7f5ea; color: #1e7d34; }
            .badge-warning { background: #fcf4e8; color: #855d10; }
            .badge-error { background: #fbeae5; color: #b32d2e; } code { background: #eee; padding: 2px 4px; border-radius: 3px; }
        </style>
        <?php
    }
}
