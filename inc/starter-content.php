<?php
/**
 * Starter content implementation
 *
 * @link https://make.wordpress.org/core/2016/11/30/starter-content-for-themes-in-4-7/
 *
 * @package WordPress
 * @subpackage Reborn
 * @since 1.0
 */

/**
 * Define and register starter content to showcase the theme on new sites.
 *
 * 定义并且注册初始化内容
 */
function reborn_starter_content_setup() {
	$starter_content = array(
		'widgets' => array(
			// Place three core-defined widgets in the sidebar area.
			'sidebar-1' => array(
				'text_about',
				'search',
				'categories',
				'archives',
				'tag_cloud',
				'recent-posts',
				'recent-comments',
				'categories',
				'meta',
			),

			// Add the core-defined business info widget to the footer 1 area.
			'sidebar-2' => array(
			),

			// Put two core-defined widgets in the footer 2 area.
			'footer-1' => array(
				'text_about',
				'search',
			),

			// Put two core-defined widgets in the footer 2 area.
			'footer-2' => array(
				'text_business_info',
				'search',
			),

			// Put two core-defined widgets in the footer 2 area.
			'footer-3' => array(
				'text_about',
				'search',
			),
		),

		// Specify the core-defined pages to create and add custom thumbnails to some of them.
		'posts' => array(
			'home',
			'about' => array(
				'thumbnail' => '{{image-vintage}}',
			),
			'contact' => array(
				'thumbnail' => '{{image-spirit}}',
			),
			'blog' => array(
				'thumbnail' => '{{image-summer}}',
			),
			'homepage-section' => array(
				'thumbnail' => '{{image-spirit}}',
			),
		),

		// Create the custom image attachments used as post thumbnails for pages.
		'attachments' => array(
			'image-spirit' => array(
				'post_title' => _x( 'Spirit', 'Theme starter content', 'reborn' ),
				'file' => 'assets/img/spirit.jpg', // URL relative to the template directory.
			),
			'image-vintage' => array(
				'post_title' => _x( 'Vintage', 'Theme starter content', 'reborn' ),
				'file' => 'assets/img/vintage.jpg',
			),
			'image-summer' => array(
				'post_title' => _x( 'Summer', 'Theme starter content', 'reborn' ),
				'file' => 'assets/img/summer.jpg',
			),
		),

		// Default to a static front page and assign the front and posts pages.
		'options' => array(
			'show_on_front' => 'page',
			'page_on_front' => '{{home}}',
			'page_for_posts' => '{{blog}}',
		),

		// Set the front page section theme mods to the IDs of the core-registered pages.
		'theme_mods' => array(
			'panel_1' => '{{homepage-section}}',
			'panel_2' => '{{about}}',
			'panel_3' => '{{blog}}',
			'panel_4' => '{{contact}}',
		),

		// Set up nav menus for each of the two areas registered in the theme.
		'nav_menus' => array(
			// Assign a menu to the "primary" location.
			'primary' => array(
				'name' => __( 'Primary Menu', 'reborn' ),
				'items' => array(
					'link_home', // Note that the core "home" page is actually a link in case a static front page is not used.
					'page_about',
					'page_blog',
					'page_contact',
				),
			),

			// Assign a menu to the "social" location.
			'social' => array(
				'name' => __( 'Social Links Menu', 'reborn' ),
				'items' => array(
					'link_yelp',
					'link_facebook',
					'link_twitter',
					'link_instagram',
					'link_email',
				),
			),

			// Assign a menu to the "social" location.
			'friendly' => array(
				'name' => __( 'Friendly Links Menu', 'reborn' ),
				'items' => array(
					'link_yelp',
					'link_facebook',
					'link_twitter',
					'link_instagram',
					'link_email',
				),
			),
		),
	);

	/**
	 * Filters Reborn array of starter content.
	 *
	 * @since Reborn 1.1
	 *
	 * @param array $starter_content Array of starter content.
	 */
	$starter_content = apply_filters( 'reborn_starter_content', $starter_content );

	add_theme_support( 'starter-content', $starter_content );
}
add_action( 'after_setup_theme', 'reborn_starter_content_setup' );
