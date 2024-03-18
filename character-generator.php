<?php
/**
 * Plugin Name:       Character Generator
 * Description:       Permet de générer des PNJs
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Miel :3
 * Author URI:		  https://pa1.aminoapps.com/6722/ba51c68395b64aebd00f4d6b2a75daa06a73e0a4_hq.gif
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       character-generator
 *
 * @package           create-block
 */

 namespace MIEL\CharacterGenerator;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

include('inc/admin/handle_admin_menus.php');
include('inc/rest/api.php');

function character_generator_init() {

	// Creates the main menu
	$admin_menus = new Inc\Admin\GenerateMenus();

	setup_api_actions();
}

// Populate our custom REST API
function setup_api_actions()
{
	add_action('rest_api_init', function() {
		register_rest_route('cg/v1', 'SavedCharacters', array(
			'methods' => 'GET',
			'callback' => 'MIEL\CharacterGenerator\Inc\Rest\get_saved_characters'
		));
		register_rest_route('cg/v1', 'Systems', array(
			'methods' => 'GET',
			'callback' => 'MIEL\CharacterGenerator\Inc\Rest\get_systems'
		));
		register_rest_route('cg/v1', 'Character', array(
			'methods' => 'GET',
			'callback' => 'MIEL\CharacterGenerator\Inc\Rest\get_character'
		));
		register_rest_route('cg/v1', 'RandomName', array(
			'methods' => 'GET',
			'callback' => 'MIEL\CharacterGenerator\Inc\Rest\get_random_name'
		));
		register_rest_route('cg/v1', 'Save', array(
			'methods' => 'POST',
			'callback' => 'MIEL\CharacterGenerator\Inc\Rest\save'
		));
		register_rest_route('cg/v1', 'Delete', array(
			'methods' => 'POST',
			'callback' => 'MIEL\CharacterGenerator\Inc\Rest\delete_character'
		));
	});
}

// Only triggers on activation
function character_generator_activate()
{
	wp_migrate_db();
}

// Setup the db to the latest version according to the files in inc/sql
function wp_migrate_db() {
    global $wpdb;

	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	
	$ds = DIRECTORY_SEPARATOR;
	$base_dir = realpath(dirname(__FILE__)  . $ds) . $ds . "inc" . $ds . "sql";

	$tables_script = file_get_contents($base_dir . $ds . "create_tables.sql");

	foreach(explode("/", $tables_script) as $table)
	{
		dbDelta($table);
	}

	$systems_script = file_get_contents($base_dir . $ds . "create_systems.sql");
	$wpdb->query($systems_script);

	$names_script = file_get_contents($base_dir . $ds . "create_names.sql");
	$wpdb->query( $names_script );
}

add_action( 'init', __NAMESPACE__ . '\character_generator_init' );
register_activation_hook( __FILE__, __NAMESPACE__ . '\character_generator_activate' );
