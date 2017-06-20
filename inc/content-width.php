<?php
/**
 * Set the content width
 *
 * @link https://codex.wordpress.org/Content_Width
 * @link https://codex.wordpress.org/oEmbed
 * @link http://www.wpbeginner.com/wp-themes/how-to-set-oembed-max-width-in-wordpress-3-5-with-content_width/
 *
 * @package WordPress
 * @subpackage Reborn
 * @since 1.0
 */

/**
 * Set the default content width.
 *
 * 设置 Embed 内容默认宽度
 */
$GLOBALS['content_width'] = 525;

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * 设置 Embed 内容默认宽度
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function reborn_content_width() {
	$content_width = $GLOBALS['content_width'];

	// Get layout.
	$page_layout = get_theme_mod( 'page_layout' );

	// Check if layout is one column.
	if ( 'one-column' === $page_layout ) {
		if ( reborn_is_frontpage() ) {
			$content_width = 644;
		} elseif ( is_page() ) {
			$content_width = 740;
		}
	}

	// Check if is single post and there is no sidebar.
	if ( is_single() && ! is_active_sidebar( 'sidebar-1' ) ) {
		$content_width = 740;
	}

	/**
	 * Filter Reborn content width of the theme.
	 *
	 * @since Reborn 1.0
	 *
	 * @param int $content_width Content width in pixels.
	 */
	$GLOBALS['content_width'] = apply_filters( 'reborn_content_width', $content_width );
}
add_action( 'template_redirect', 'reborn_content_width', 0 );
