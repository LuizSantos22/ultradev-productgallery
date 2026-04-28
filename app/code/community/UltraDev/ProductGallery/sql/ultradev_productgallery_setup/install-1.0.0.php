<?php

/** * Product Gallery Attribute Setup
 * Optimized for OpenMage 20.x and PHP 8.2
 * @var Mage_Catalog_Model_Resource_Setup $installer 
 */
$installer = $this;
$installer->startSetup();

$attributeCode = 'ultrd_gallery_video';

// We use addAttribute but ensure all necessary frontend flags are set
$installer->addAttribute(
    Mage_Catalog_Model_Product::ENTITY,
    $attributeCode,
    array(
        'group'             => 'Images',
        'type'              => 'varchar', // Varchar is better for URLs than text
        'label'             => 'Gallery Video URL',
        'input'             => 'text',
        'global'            => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_STORE,
        'visible'           => true,
        'required'          => false,
        'user_defined'      => true,
        'default'           => '',
        'searchable'        => false,
        'filterable'        => false,
        'comparable'        => false,
        'visible_on_front'  => true, // Essential to ensure it's available in the product object on frontend
        'unique'            => false,
        'sort_order'        => 200,
        'apply_to'          => 'simple,configurable,bundle,grouped', // Apply to all main product types
    )
);

$installer->endSetup();