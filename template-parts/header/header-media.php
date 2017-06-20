<?php
/**
 * Displays header media
 *
 * @package WordPress
 * @subpackage Reborn
 * @since 1.0
 * @version 1.0
 */

/*
	// If a regular post or page, and not the front page, show the featured image.
	// Using get_queried_object_id() here since the $post global may not be set before a call to the_post().
	if ( ( is_single() || ( is_page() && ! reborn_is_frontpage() ) ) && has_post_thumbnail( get_queried_object_id() ) ) :
		echo '<div class="single-featured-image-header">';
		echo get_the_post_thumbnail( get_queried_object_id(), 'reborn-featured-image' );
		echo '</div><!-- .single-featured-image-header -->';
	endif;
	?>
 */
?>
<?php if ( ( is_single() || ( is_page() && ! reborn_is_frontpage() ) ) && has_post_thumbnail( get_queried_object_id() ) ) : ?>
<div class="featured">
  <div class="container">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="index.html">首页</a></li>
      <li class="breadcrumb-item active">毕业季</li>
    </ol>
    <h1 class="title">毕业季</h1>
    <h3 class="slogan">你总说毕业遥遥无期，转眼间就各奔东西。</h3>
  </div>
  <div class="media"><i class="mask"></i><?php echo get_the_post_thumbnail( get_queried_object_id(), 'reborn-featured-image' ); ?></div>
</div><!-- .featured -->
<?php else : ?>
<div class="hero">
  <div class="intro">
    <h1 class="title">One Belt, One Road</h1>
    <h3 class="slogan">Thoughts, stories and ideas.</h3><a class="btn btn-outline-secondary btn-xlg btn-pill" href="#first">Getting started</a>
  </div>
  <div class="media"><i class="mask"></i><?php echo the_header_image_tag(); /*the_custom_header_markup();*/ ?></div>
</div><!-- .hero -->
<?php endif; ?>
