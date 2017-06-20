<?php
/**
 * Displays top navigation
 *
 * @package WordPress
 * @subpackage Reborn
 * @since 1.0
 * @version 1.2
 */

/*
<nav id="site-navigation" class="main-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Primary Menu', 'reborn' ); ?>">
	<button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false">
		<?php
		echo reborn_get_svg( array( 'icon' => 'bars' ) );
		echo reborn_get_svg( array( 'icon' => 'close' ) );
		_e( 'Menu', 'reborn' );
		?>
	</button>

	<?php wp_nav_menu( array(
		'theme_location' => 'primary',
		'menu_id'        => 'primary-menu',
	) ); ?>

	<?php if ( ( reborn_is_frontpage() || ( is_home() && is_front_page() ) ) && has_custom_header() ) : ?>
		<a href="#content" class="menu-scroll-down"><?php echo reborn_get_svg( array( 'icon' => 'arrow-right' ) ); ?><span class="screen-reader-text"><?php _e( 'Scroll down to content', 'reborn' ); ?></span></a>
	<?php endif; ?>
</nav><!-- #site-navigation -->
 */

?>
<div class="navbar">
	<div class="container">
		<?php get_template_part( 'template-parts/navbar/site', 'branding' ); ?>
		<button class="navbar-toggler collapsed" data-toggle="collapse" data-target="#site-menu" aria-controls="site-menu" aria-expanded="false" aria-label="<?php esc_attr_e( 'Toggle primary Menu', 'reborn' ); ?>">
			<span class="navbar-toggler-icon"></span>
		</button>
		<nav class="navbar-collapse collapse" id="site-menu" role="navigation" aria-label="<?php esc_attr_e( 'Primary Menu', 'reborn' ); ?>">
			<?php if ( has_nav_menu( 'primary' ) ) : ?>
			<ul class="navbar-nav">
				<li class="nav-item active">
					<a class="nav-link" href="index.html">Home <span class="sr-only">(current)</span></a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="single.html">学习</a>
				</li>
				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" href="archive.html" data-toggle="dropdown">博客</a>
					<div class="dropdown-menu">
						<a class="dropdown-item" href="archive.html">未分类</a>
						<a class="dropdown-item" href="archive.html">爱生活</a>
						<a class="dropdown-item" href="archive.html">旅行</a>
						<a class="dropdown-item" href="archive.html">音乐</a>
						<a class="dropdown-item" href="archive.html">诗和远方</a>
					</div>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="demo.html">实验室</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#">问答</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#">TRY IT</a>
				</li>
			</ul>
			<?php endif; ?>
			<form class="form-inline" action="/">
				<input class="form-control" id="search-form" type="search" name="s" placeholder="搜索..." autocomplete="off">
				<label class="icon-magnifier" for="search-form"></label>
			</form>
		</nav>
	</div><!-- .container -->
</div><!-- .navbar -->

