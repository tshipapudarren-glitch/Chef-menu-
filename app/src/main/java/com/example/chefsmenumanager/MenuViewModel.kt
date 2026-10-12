package com.example.chefsmenumanager

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

class MenuViewModel : ViewModel() {
    // Full list of menu items with sample data for testing
    private val _menuItems = MutableStateFlow<List<MenuItem>>(listOf(
        MenuItem(name = "Garden Salad", description = "Fresh greens with balsamic", course = "Starter", price = 55.0),
        MenuItem(name = "Beef Burger", description = "Juicy patty with chips", course = "Main Course", price = 120.0),
        MenuItem(name = "Chocolate Mousse", description = "Rich dark chocolate", course = "Dessert", price = 65.0)
    ))
    val menuItems: StateFlow<List<MenuItem>> = _menuItems

    // Add Item
    fun addItem(item: MenuItem) {
        _menuItems.value = _menuItems.value + item
    }

    // Edit Item (Requirement 1)
    fun updateItem(updatedItem: MenuItem) {
        _menuItems.value = _menuItems.value.map { 
            if (it.id == updatedItem.id) updatedItem else it 
        }
    }

    // Delete Item (Requirement 1)
    fun deleteItem(id: String) {
        _menuItems.value = _menuItems.value.filter { it.id != id }
    }

    // Statistics Calculations (Requirement 3)
    fun getTotalItems(): Int = _menuItems.value.size

    fun getAveragePrice(): Double {
        if (_menuItems.value.isEmpty()) return 0.0
        return _menuItems.value.sumOf { it.price } / _menuItems.value.size
    }

    fun getItemCountByCourse(course: String): Int {
        return _menuItems.value.count { it.course.equals(course, ignoreCase = true) }
    }

    // Implement Search & Filtering Logic (Requirement 2)
    fun getFilteredItems(searchQuery: String, selectedCourse: String): List<MenuItem> {
        return _menuItems.value.filter { item ->
            val matchesSearch = item.name.contains(searchQuery, ignoreCase = true)
            val matchesCourse = selectedCourse == "All" || item.course.equals(selectedCourse, ignoreCase = true)
            matchesSearch && matchesCourse
        }
    }
}
