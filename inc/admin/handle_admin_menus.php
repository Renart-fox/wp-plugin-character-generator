<?php

namespace MIEL\CharacterGenerator\Inc\Admin;

class GenerateMenus {
	public function __construct() {
		add_action('admin_menu', array( $this, 'register_menus'));
		add_shortcode( 'shortcode_character_generator_saved_characters', array( $this, 'shortcode_character_generator_saved_characters'));
		add_shortcode( 'shortcode_character_generator_generator', array( $this, 'shortcode_character_generator_generator'));
	}

	// Registers the main menu and the submenus
	public function register_menus() {
		$main_slug = 'cg';
		// Main menu page is a placeholder relocating the user to the first submenu
		add_menu_page('Générateur de personnages', 'Générateur de personnages', '', $main_slug, array( $this, 'character_generator_page'), 'dashicons-universal-access', 21);
		add_submenu_page($main_slug, 'Générateur de personnages', 'Générateur de personnages', 'publish_posts', 'character-generator', array( $this, 'character_generator_page'), 1);
		add_submenu_page($main_slug, 'Personnages sauvegardés', 'Personnages sauvegardés', 'publish_posts', 'saved-characters', array( $this, 'character_generator_saved_characters'), 11);
	}
	
	// Page content
	public function character_generator_page() {
		# Trick to provide a React page
		echo do_shortcode('[shortcode_character_generator_generator]');
	}
	
	public function character_generator_saved_characters(){
		# Trick to provide a React page
		echo do_shortcode('[shortcode_character_generator_saved_characters]');
	}


	/** 
	 * True for all of the following functions :
	 * 
	 * Loads the correct React code into each page
	 * 
	 **/
	public function shortcode_character_generator_saved_characters($atts = array(), $content = null , $tag = 'shortcode_character_generator_saved_characters'){
		// ToDo - Clean these 2 variables because they're reusable
		$ds = DIRECTORY_SEPARATOR;
		$base_dir = realpath(dirname(__FILE__)  . $ds . '..') . $ds;

		ob_start();
    ?>
        <div id="cg-saved-characters"></div>
		<?php wp_enqueue_script( 'cg-saved-characters', plugins_url( 'build' . $ds . 'components' . $ds . 'savedCharactersList.js', $base_dir ), array( 'wp-element' ), time(), true ); ?>
    <?php 
    return ob_get_clean();
	}

	public function shortcode_character_generator_generator($atts = array(), $content = null , $tag = 'shortcode_character_generator_generator'){

		?>
			<script>
				window.wpnonce=<?php echo json_encode(wp_create_nonce('wp_rest')); ?>;
			</script>
		<?php

		// ToDo - Clean these 2 variables because they're reusable
		$ds = DIRECTORY_SEPARATOR;
		$base_dir = realpath(dirname(__FILE__)  . $ds . '..') . $ds;

		ob_start();
    ?>
        <div id="cg-generator"></div>
		<?php wp_enqueue_script( 'cg-generator', plugins_url( 'build' . $ds . 'components' . $ds . 'generator.js', $base_dir ), array( 'wp-element' ), time(), true ); ?>
    <?php 
    return ob_get_clean();
	}
}