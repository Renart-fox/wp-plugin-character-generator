<?php

// Custom REST API setup !

namespace MIEL\CharacterGenerator\Inc\Rest;

// Retrieves all the saved characters in the database
// Returns an array of (character ID, character name and character's system name)
function get_saved_characters(){
    global $wpdb;

    $results = $wpdb->get_results("
			Select wp_cg_characters.id AS ID, wp_cg_characters.cg_name AS Personnage, wp_cg_systems.cg_name AS Systeme FROM wp_cg_characters_systems
			JOIN wp_cg_characters on wp_cg_characters_systems.characterId = wp_cg_characters.id
			JOIN wp_cg_systems on wp_cg_characters_systems.systemId = wp_cg_systems.id;
	");
    
    return $results;
}

// Retrieves all the systems
function get_systems(){
    global $wpdb;

    $results = $wpdb->get_results("
			SELECT wp_cg_systems.id AS ID, wp_cg_systems.cg_name AS Systeme FROM wp_cg_systems;
	");
    
    return $results;
}

// Retrieve a specific character from a provided character ID
function get_character($request)
{
    global $wpdb;

    $params = $request->get_query_params();
    $id = $params['id'];

    return $wpdb->get_results("
        SELECT wp_cg_characters_systems.systemId, cg_name AS name, cg_obj FROM wp_cg_characters
        JOIN wp_cg_characters_systems ON wp_cg_characters_systems.characterId = wp_cg_characters.id
        WHERE wp_cg_characters.id = " . $id . " ;
    ");
}

// Generates a random name for a character based on their system
function get_random_name($request)
{
    global $wpdb;

    $params = $request->get_query_params();
    $systemId = $params['system'];

    $system = $wpdb->get_results("SELECT cg_name FROM wp_cg_systems WHERE id = " . $systemId . ";")[0]->{"cg_name"};

    $randFirstName = rand(1, 100);
    $randLastName = rand(1, 100);

    $firstName = $wpdb->get_results("SELECT first_name from wp_cg_" . $system . "_names WHERE id = " . $randFirstName . ";")[0]->{"first_name"};
    $lastName = $wpdb->get_results("SELECT last_name from wp_cg_" . $system . "_names WHERE id = " . $randLastName . ";")[0]->{"last_name"};

    return array ( "name" => $firstName . " " . $lastName );
}

// Deletes a character based on a provided character ID
function delete_character($request)
{
    global $wpdb;

    $params = $request->get_json_params();
    $id = $params['id'];

    $wpdb->delete('wp_cg_characters_systems', array ('characterId' => $id));
    $wpdb->delete('wp_cg_characters', array ('id' => $id));

    return $params;
}

// Saves a character
// ToDo also update the character if the ID is the same
function save($request){
    global $wpdb;

    $params = $request->get_json_params();
    $name = $params['name'];
    $cg_obj = json_encode($params['cg_obj']);
    $system = $params['system'];
    //$id = $params['id'];
    
    $wpdb->insert('wp_cg_characters', array ('cg_name' => $name, 'cg_obj' => $cg_obj));
    $wpdb->insert('wp_cg_characters_systems', array ('characterId' => $wpdb->insert_id, 'systemId' => $system));

    return $params;
}