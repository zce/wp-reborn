<?php
/**
 * Reborn functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package WordPress
 * @subpackage Reborn
 * @since 1.0
 */

/**
 * Reborn only works in WordPress 4.7 or later.
 *
 * 确保 WordPress 版本高于 4.7
 */
if ( version_compare( $GLOBALS['wp_version'], '4.7-alpha', '<' ) ) {
	require get_template_directory() . '/inc/back-compat.php';
	return;
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 *
 * 设置主题的各项默认值以及注册器，从而支持各种 WordPress 功能
 *
 * @link https://developer.wordpress.org/reference/functions/add_theme_support/
 * @link https://codex.wordpress.org/Theme_Features
 */
function reborn_setup() {
	/*
	 * Make theme available for translation.
	 * Translations can be filed at WordPress.org. See: https://translate.wordpress.org/projects/wp-themes/twentyseventeen
	 * If you're building a theme based on Reborn, use a find and replace
	 * to change 'reborn' to the name of your theme in all the template files.
	 *
	 * 加载多语言包
	 */
	load_theme_textdomain( 'reborn', get_template_directory() . '/languages' );

	/**
	 * Add default posts and comments RSS feed links to head.
	 *
	 * 增加 RSS feed link 功能
	 */
	add_theme_support( 'automatic-feed-links' );

	/*
	 * Let WordPress manage the document title.
	 * By adding theme support, we declare that this theme does not use a
	 * hard-coded <title> tag in the document head, and expect WordPress to
	 * provide it for us.
	 *
	 * 增加 title 标签功能
	 */
	add_theme_support( 'title-tag' );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
	 *
	 * 启用发表物和页面的特色图像功能
	 */
	add_theme_support( 'post-thumbnails' );

	/**
	 * 设置支持的特色图像尺寸
	 * @link https://developer.wordpress.org/reference/functions/set_post_thumbnail_size/
	 */
	add_image_size( 'reborn-featured-image', 2000, 1200, true );
	// add_image_size( 'reborn-thumbnail-avatar', 100, 100, true );

	/**
	 * This theme uses wp_nav_menu() in two locations.
	 *
	 * 注册导航菜单
	 */
	register_nav_menus( array(
		'primary'   => __( 'Primary Menu', 'reborn' ),
		'social' 		=> __( 'Social Links Menu', 'reborn' ),
		'friendly' 	=> __( 'Friendly Links Menu', 'reborn' ),
	) );

	/*
	 * Switch default core markup for search form, comment form, and comments to output valid HTML5.
	 *
	 * 将内置标记切换为 HTML5 模式
	 */
	add_theme_support( 'html5', array(
		'search-form', 'comment-form', 'comment-list', 'gallery', 'caption'
	) );

	/*
	 * Enable support for Post Formats.
	 *
	 * See: https://codex.wordpress.org/Post_Formats
	 *
	 * 设置受支持的内容形式
	 */
	add_theme_support( 'post-formats', array(
		'aside', 'image', 'video', 'quote', 'link', 'gallery', 'status', 'audio', 'chat'
	) );

	/**
	 * Add theme support for Custom Logo.
	 *
	 * 支持自定义 Logo
	 */
	add_theme_support( 'custom-logo', array(
		'width'       => 40,
		'height'      => 250,
		'flex-width'  => true,
	) );

	/**
	 * Add theme support for selective refresh for widgets.
	 *
	 * 支持挂件选择性刷新
	 */
	add_theme_support( 'customize-selective-refresh-widgets' );

	/*
	 * This theme styles the visual editor to resemble the theme style,
	 * specifically font, colors, and column width.
	 *
	 * 添加文本编辑器中的文本样式
 	 */
	add_editor_style( array( 'assets/css/editor-style.css', reborn_fonts_url() ) );
}
add_action( 'after_setup_theme', 'reborn_setup' );

/**
 * Register custom fonts.
 *
 * 注册自定义字体
 */
function reborn_fonts_url() {
	$fonts_url = '';

	/*
	 * Translators: If there are characters in your language that are not
	 * supported by Libre Franklin, translate this to 'off'. Do not translate
	 * into your own language.
	 */
	$libre_franklin = _x( 'on', 'Libre Franklin font: on or off', 'reborn' );

	if ( 'off' !== $libre_franklin ) {
		$font_families = array();

		$font_families[] = 'Libre Franklin:300,300i,400,400i,600,600i,800,800i';

		$query_args = array(
			'family' => urlencode( implode( '|', $font_families ) ),
			'subset' => urlencode( 'latin,latin-ext' ),
		);

		$fonts_url = add_query_arg( $query_args, 'https://fonts.googleapis.com/css' );
	}

	return esc_url_raw( $fonts_url );
}

/**
 * Add preconnect for Google Fonts.
 *
 * 添加 Google Font 预加载
 *
 * @since Reborn 1.0
 *
 * @param array  $urls           URLs to print for resource hints.
 * @param string $relation_type  The relation type the URLs are printed.
 * @return array $urls           URLs to print for resource hints.
 */
function reborn_resource_hints( $urls, $relation_type ) {
	if ( wp_style_is( 'reborn-fonts', 'queue' ) && 'preconnect' === $relation_type ) {
		$urls[] = array(
			'href' => 'https://fonts.gstatic.com',
			'crossorigin',
		);
	}
	return $urls;
}
add_filter( 'wp_resource_hints', 'reborn_resource_hints', 10, 2 );

/**
 * Replaces "[...]" (appended to automatically generated excerpts) with ... and
 * a 'Continue reading' link.
 *
 * @since Reborn 1.0
 *
 * @param string $link Link to single post/page.
 * @return string 'Continue reading' link prepended with an ellipsis.
 */
function reborn_excerpt_more( $link ) {
	if ( is_admin() ) {
		return $link;
	}

	$link = sprintf( '<p class="link-more"><a href="%1$s" class="more-link">%2$s</a></p>',
		esc_url( get_permalink( get_the_ID() ) ),
		/* translators: %s: Name of current post */
		sprintf( __( 'Continue reading<span class="screen-reader-text"> "%s"</span>', 'reborn' ), get_the_title( get_the_ID() ) )
	);
	return ' &hellip; ' . $link;
}
add_filter( 'excerpt_more', 'reborn_excerpt_more' );

/**
 * Handles JavaScript detection.
 *
 * Adds a `js` class to the root `<html>` element when JavaScript is detected.
 *
 * @since Reborn 1.0
 */
function reborn_javascript_detection() {
	echo "<script>(function(html){html.className = html.className.replace(/\bno-js\b/,'js')})(document.documentElement);</script>\n";
}
add_action( 'wp_head', 'reborn_javascript_detection', 0 );

/**
 * Add a pingback url auto-discovery header for singularly identifiable articles.
 */
function reborn_pingback_header() {
	if ( is_singular() && pings_open() ) {
		printf( '<link rel="pingback" href="%s">' . "\n", get_bloginfo( 'pingback_url' ) );
	}
}
add_action( 'wp_head', 'reborn_pingback_header' );

/**
 * Display custom color CSS.
 */
function reborn_colors_css_wrap() {
	if ( 'custom' !== get_theme_mod( 'colorscheme' ) && ! is_customize_preview() ) {
		return;
	}

	require_once( get_parent_theme_file_path( '/inc/color-patterns.php' ) );
	$hue = absint( get_theme_mod( 'colorscheme_hue', 250 ) );
?>
	<style type="text/css" id="custom-theme-colors" <?php if ( is_customize_preview() ) { echo 'data-hue="' . $hue . '"'; } ?>>
		<?php echo reborn_custom_colors_css(); ?>
	</style>
<?php }
add_action( 'wp_head', 'reborn_colors_css_wrap' );

/**
 * Enqueue scripts and styles.
 */
function reborn_scripts() {
	// Add custom fonts, used in the main stylesheet.
	wp_enqueue_style( 'reborn-fonts', reborn_fonts_url(), array(), null );

	// Theme stylesheet.
	wp_enqueue_style( 'reborn-style', get_stylesheet_uri() );

	// Load the dark colorscheme.
	if ( 'dark' === get_theme_mod( 'colorscheme', 'light' ) || is_customize_preview() ) {
		wp_enqueue_style( 'reborn-colors-dark', get_theme_file_uri( '/assets/css/colors-dark.css' ), array( 'reborn-style' ), '1.0' );
	}

	// Load the Internet Explorer 9 specific stylesheet, to fix display issues in the Customizer.
	if ( is_customize_preview() ) {
		wp_enqueue_style( 'reborn-ie9', get_theme_file_uri( '/assets/css/ie9.css' ), array( 'reborn-style' ), '1.0' );
		wp_style_add_data( 'reborn-ie9', 'conditional', 'IE 9' );
	}

	// Load the Internet Explorer 8 specific stylesheet.
	wp_enqueue_style( 'reborn-ie8', get_theme_file_uri( '/assets/css/ie8.css' ), array( 'reborn-style' ), '1.0' );
	wp_style_add_data( 'reborn-ie8', 'conditional', 'lt IE 9' );

	// Load the html5 shiv.
	wp_enqueue_script( 'html5', get_theme_file_uri( '/assets/js/html5.js' ), array(), '3.7.3' );
	wp_script_add_data( 'html5', 'conditional', 'lt IE 9' );

	wp_enqueue_script( 'reborn-skip-link-focus-fix', get_theme_file_uri( '/assets/js/skip-link-focus-fix.js' ), array(), '1.0', true );

	$reborn_l10n = array(
		'quote'          => reborn_get_svg( array( 'icon' => 'quote-right' ) ),
	);

	if ( has_nav_menu( 'primary' ) ) {
		wp_enqueue_script( 'reborn-navigation', get_theme_file_uri( '/assets/js/navigation.js' ), array( 'jquery' ), '1.0', true );
		$reborn_l10n['expand']         = __( 'Expand child menu', 'reborn' );
		$reborn_l10n['collapse']       = __( 'Collapse child menu', 'reborn' );
		$reborn_l10n['icon']           = reborn_get_svg( array( 'icon' => 'angle-down', 'fallback' => true ) );
	}

	wp_enqueue_script( 'reborn-global', get_theme_file_uri( '/assets/js/global.js' ), array( 'jquery' ), '1.0', true );

	wp_enqueue_script( 'jquery-scrollto', get_theme_file_uri( '/assets/js/jquery.scrollTo.js' ), array( 'jquery' ), '2.1.2', true );

	wp_localize_script( 'reborn-skip-link-focus-fix', 'rebornScreenReaderText', $reborn_l10n );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'reborn_scripts' );

/**
 * Add custom image sizes attribute to enhance responsive image functionality
 * for content images.
 *
 * @since Reborn 1.0
 *
 * @param string $sizes A source size value for use in a 'sizes' attribute.
 * @param array  $size  Image size. Accepts an array of width and height
 *                      values in pixels (in that order).
 * @return string A source size value for use in a content image 'sizes' attribute.
 */
function reborn_content_image_sizes_attr( $sizes, $size ) {
	$width = $size[0];

	if ( 740 <= $width ) {
		$sizes = '(max-width: 706px) 89vw, (max-width: 767px) 82vw, 740px';
	}

	if ( is_active_sidebar( 'sidebar-1' ) || is_archive() || is_search() || is_home() || is_page() ) {
		if ( ! ( is_page() && 'one-column' === get_theme_mod( 'page_options' ) ) && 767 <= $width ) {
			 $sizes = '(max-width: 767px) 89vw, (max-width: 1000px) 54vw, (max-width: 1071px) 543px, 580px';
		}
	}

	return $sizes;
}
add_filter( 'wp_calculate_image_sizes', 'reborn_content_image_sizes_attr', 10, 2 );

/**
 * Filter the `sizes` value in the header image markup.
 *
 * @since Reborn 1.0
 *
 * @param string $html   The HTML image tag markup being filtered.
 * @param object $header The custom header object returned by 'get_custom_header()'.
 * @param array  $attr   Array of the attributes for the image tag.
 * @return string The filtered header image HTML.
 */
function reborn_header_image_tag( $html, $header, $attr ) {
	if ( isset( $attr['sizes'] ) ) {
		$html = str_replace( $attr['sizes'], '100vw', $html );
	}
	return $html;
}
add_filter( 'get_header_image_tag', 'reborn_header_image_tag', 10, 3 );

/**
 * Add custom image sizes attribute to enhance responsive image functionality for post thumbnails.
 *
 * @since Reborn 1.0
 *
 * @param array $attr       Attributes for the image markup.
 * @param int   $attachment Image attachment ID.
 * @param array $size       Registered image size or flat array of height and width dimensions.
 * @return string A source size value for use in a post thumbnail 'sizes' attribute.
 */
function reborn_post_thumbnail_sizes_attr( $attr, $attachment, $size ) {
	if ( is_archive() || is_search() || is_home() ) {
		$attr['sizes'] = '(max-width: 767px) 89vw, (max-width: 1000px) 54vw, (max-width: 1071px) 543px, 580px';
	} else {
		$attr['sizes'] = '100vw';
	}

	return $attr;
}
add_filter( 'wp_get_attachment_image_attributes', 'reborn_post_thumbnail_sizes_attr', 10, 3 );

/**
 * Use front-page.php when Front page displays is set to a static page.
 *
 * @since Reborn 1.0
 *
 * @param string $template front-page.php.
 *
 * @return string The template to be used: blank if is_home() is true (defaults to index.php), else $template.
 */
function reborn_front_page_template( $template ) {
	return is_home() ? '' : $template;
}
add_filter( 'frontpage_template',  'reborn_front_page_template' );

/**
 * Implement the Starter content feature.
 */
require get_parent_theme_file_path( '/inc/starter-content.php' );

/**
 * Implement the Custom Header feature.
 */
require get_parent_theme_file_path( '/inc/custom-header.php' );

/**
 * Set content width.
 */
require get_parent_theme_file_path( '/inc/content-width.php' );

/**
 * Register widget area.
 */
require get_parent_theme_file_path( '/inc/widgets.php' );

/**
 * Custom template tags for this theme.
 */
require get_parent_theme_file_path( '/inc/template-tags.php' );

/**
 * Additional features to allow styling of the templates.
 */
require get_parent_theme_file_path( '/inc/template-functions.php' );

/**
 * Customizer additions.
 */
require get_parent_theme_file_path( '/inc/customizer.php' );

/**
 * SVG icons functions and filters.
 */
require get_parent_theme_file_path( '/inc/icon-functions.php' );
