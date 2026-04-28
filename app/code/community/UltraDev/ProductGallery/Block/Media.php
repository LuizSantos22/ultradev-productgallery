<?php

/**
 * Product Media Block
 * Modified to support video attributes and OpenMage PHP 8.2 compatibility
 */
class UltraDev_ProductGallery_Block_Media extends Mage_Catalog_Block_Product_View_Media
{
    /**
     * Get the video URL from the product attribute
     * Note: Ensure the attribute code matches 'ultrd_gallery_video' in your admin
     * * @return string
     */
    public function getVideoUrl()
    {
        $product = $this->getProduct();
        if (!$product) {
            return '';
        }

        $videoUrl = $product->getData('ultrd_gallery_video');
        return is_string($videoUrl) ? trim($videoUrl) : '';
    }

    /**
     * Check if the product has a gallery video URL
     * * @return bool
     */
    public function hasVideo()
    {
        return $this->getVideoUrl() !== '';
    }
}