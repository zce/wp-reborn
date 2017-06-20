<?php
/**
 * Template part for displaying posts
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package WordPress
 * @subpackage Reborn
 * @since 1.0
 * @version 1.2
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class('card card-entry'); ?>>
	<header class="card-header">
		<?php if ( is_sticky() && is_home() ) : ?>
		<div class="card-sticky"><i></i><i></i><i></i></div>
		<?php endif; ?>
		<?php if ( '' !== get_the_post_thumbnail() && ! is_single() ) : ?>
		<a href="<?php the_permalink(); ?>">
			<?php the_post_thumbnail( 'reborn-featured-image', ['class' => 'card-img-top'] ); ?>
		</a>
		<?php endif; ?>
		<div class="card-img-overlay">
			<?php if ( 'post' === get_post_type() ) : ?>
			<div class="card-meta">
				<?php
				if ( is_single() ) {
					reborn_posted_on();
				} else {
					echo reborn_time_link();
					reborn_edit_link();
				};
				?>
			</div><!-- .card-meta -->
			<?php endif;?>
		</div>
	</header><!-- .card-header -->

	<content class="card-block">
		<?php
		if ( is_single() ) {
			the_title( '<h1 class="card-title">', '</h1>' );
		} elseif ( is_front_page() && is_home() ) {
			the_title( '<h3 class="card-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h3>' );
		} else {
			the_title( '<h2 class="card-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
		}

		/* translators: %s: Name of current post */
		the_content( sprintf(
			__( 'Continue reading<span class="screen-reader-text"> "%s"</span>', 'reborn' ),
			get_the_title()
		) );

		wp_link_pages( array(
			'before'      => '<div class="page-links">' . __( 'Pages:', 'reborn' ),
			'after'       => '</div>',
			'link_before' => '<span class="page-number">',
			'link_after'  => '</span>',
		) );
		?>
	</content><!-- .card-block -->

	<footer class="card-footer">
		<span class="icon-tag"><a href="archive.html">旅行</a>、<a href="archive.html">远方</a></span>
		<a href="single.html">继续阅读 →</a>
	</footer>

	<?php
	if ( is_single() ) {
		reborn_entry_footer();
	}
	?>

</article><!-- #post-## -->
