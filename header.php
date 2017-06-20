<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package WordPress
 * @subpackage Reborn
 * @since 1.0
 * @version 1.0
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js no-svg">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<div id="page" class="site">
	<a class="sr-only sr-only-focusable" href="#content"><?php _e( 'Skip to content', 'reborn' ); ?></a>

	<header class="site-header" role="banner">
		<?php get_template_part( 'template-parts/navbar/navbar', 'top' ); ?>
		<?php get_template_part( 'template-parts/header/header', 'media' ); ?>
	</header><!-- .site-header -->

	<?php if ( is_home() ) : ?>
	<div class="site-main container">
	<?php else : ?>
	<main class="site-main">
	<?php endif;
