<?php
/**
 * Register widget area.
 *
 * 注册小工具区域
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 *
 * @package WordPress
 * @subpackage Reborn
 * @since 1.0
 */

/**
 * Register widget area.
 */
function reborn_widgets_init() {
	// 页脚 1
	register_sidebar( array(
		'name'          => __( 'Footer 1', 'reborn' ),
		'id'            => 'footer-1',
		'description'   => __( 'Add widgets here to appear in your footer.', 'reborn' ),
		'before_widget' => '<section id="%1$s" class="card card-widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="card-header">',
		'after_title'   => '</h2>',
	) );

	// 页脚 2
	register_sidebar( array(
		'name'          => __( 'Footer 2', 'reborn' ),
		'id'            => 'footer-2',
		'description'   => __( 'Add widgets here to appear in your footer.', 'reborn' ),
		'before_widget' => '<section id="%1$s" class="card card-widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="card-header">',
		'after_title'   => '</h2>',
	) );

	// 页脚 3
	register_sidebar( array(
		'name'          => __( 'Footer 3', 'reborn' ),
		'id'            => 'footer-3',
		'description'   => __( 'Add widgets here to appear in your footer.', 'reborn' ),
		'before_widget' => '<section id="%1$s" class="card card-widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="card-header">',
		'after_title'   => '</h2>',
	) );

	// 侧边栏 1
	register_sidebar( array(
		'name'          => __( 'Sidebar 1', 'reborn' ),
		'id'            => 'sidebar-1',
		'description'   => __( 'Add widgets here to appear in your sidebar on archive pages.', 'reborn' ),
		'before_widget' => '<section id="%1$s" class="card card-widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="card-header">',
		'after_title'   => '</h2>',
	) );

	// 侧边栏 2
	register_sidebar( array(
		'name'          => __( 'Sidebar 2', 'reborn' ),
		'id'            => 'sidebar-2',
		'description'   => __( 'Add widgets here to appear in your sidebar on blog posts.', 'reborn' ),
		'before_widget' => '<section id="%1$s" class="card card-widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="card-header">',
		'after_title'   => '</h2>',
	) );
}
add_action( 'widgets_init', 'reborn_widgets_init' );
