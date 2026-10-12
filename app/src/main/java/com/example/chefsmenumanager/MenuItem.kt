package com.example.chefsmenumanager

import java.util.UUID

data class MenuItem(
    val id: String = UUID.randomUUID().toString(),
    var name: String,
    var description: String,
    var course: String, // "Starter", "Main Course", "Dessert"
    var price: Double
)
