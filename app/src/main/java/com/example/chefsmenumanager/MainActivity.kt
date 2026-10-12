package com.example.chefsmenumanager

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    ChefMenuApp()
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChefMenuApp(menuViewModel: MenuViewModel = viewModel()) {
    val menuItems by menuViewModel.menuItems.collectAsState()
    val scope = rememberCoroutineScope()
    val snackbarHostState = remember { SnackbarHostState() }
    
    var searchQuery by remember { mutableStateOf("") }
    var selectedCourse by remember { mutableStateOf("All") }
    var showAddDialog by remember { mutableStateOf(false) }
    var editingItem by remember { mutableStateOf<MenuItem?>(null) }

    val filteredItems = menuViewModel.getFilteredItems(searchQuery, selectedCourse)

    Scaffold(
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) },
        topBar = {
            TopAppBar(
                title = { Text("Chef's Menu Manager") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = { showAddDialog = true }) {
                Text("+", fontSize = 24.sp)
            }
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding).padding(16.dp)) {
            // Statistics Card (Requirement 3)
            StatsSection(menuViewModel)

            Spacer(modifier = Modifier.height(16.dp))

            // Search & Filter (Requirement 2)
            SearchFilterSection(
                searchQuery = searchQuery,
                onSearchChange = { searchQuery = it },
                selectedCourse = selectedCourse,
                onCourseSelect = { selectedCourse = it },
                onClear = {
                    searchQuery = ""
                    selectedCourse = "All"
                }
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Menu List (Requirement 1)
            Text("Menu Items", style = MaterialTheme.typography.titleMedium, modifier = Modifier.padding(bottom = 8.dp))
            
            if (filteredItems.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text(
                        if (menuItems.isEmpty()) "Start by adding items to the menu!" else "No items match your search", 
                        color = Color.Gray
                    )
                }
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(filteredItems, key = { it.id }) { item ->
                        MenuItemCard(
                            item = item,
                            onDelete = { 
                                menuViewModel.deleteItem(item.id)
                                scope.launch { snackbarHostState.showSnackbar("Item deleted successfully") }
                            },
                            onEdit = { editingItem = item }
                        )
                    }
                }
            }
        }
    }

    // Dialogs for Add/Edit
    if (showAddDialog) {
        MenuEntryDialog(
            onDismiss = { showAddDialog = false },
            onConfirm = { newItem ->
                menuViewModel.addItem(newItem)
                showAddDialog = false
                scope.launch { snackbarHostState.showSnackbar("Item added successfully") }
            }
        )
    }

    editingItem?.let { item ->
        MenuEntryDialog(
            initialItem = item,
            onDismiss = { editingItem = null },
            onConfirm = { updatedItem ->
                menuViewModel.updateItem(updatedItem)
                editingItem = null
                scope.launch { snackbarHostState.showSnackbar("Item updated successfully") }
            }
        )
    }
}

@Composable
fun StatsSection(viewModel: MenuViewModel) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Menu Summary", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = MaterialTheme.colorScheme.onSecondaryContainer)
            Spacer(modifier = Modifier.height(8.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("Total Items: ${viewModel.getTotalItems()}")
                Text("Avg Price: R%.2f".format(viewModel.getAveragePrice()))
            }
            HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = MaterialTheme.colorScheme.onSecondaryContainer.copy(alpha = 0.2f))
            Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                Text("Starters: ${viewModel.getItemCountByCourse("Starter")}", style = MaterialTheme.typography.bodySmall)
                Text("Main: ${viewModel.getItemCountByCourse("Main Course")}", style = MaterialTheme.typography.bodySmall)
                Text("Desserts: ${viewModel.getItemCountByCourse("Dessert")}", style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SearchFilterSection(
    searchQuery: String,
    onSearchChange: (String) -> Unit,
    selectedCourse: String,
    onCourseSelect: (String) -> Unit,
    onClear: () -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        OutlinedTextField(
            value = searchQuery,
            onValueChange = onSearchChange,
            label = { Text("Search by name") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )
        
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            val courses = listOf("All", "Starter", "Main Course", "Dessert")
            courses.forEach { course ->
                FilterChip(
                    selected = selectedCourse == course,
                    onClick = { onCourseSelect(course) },
                    label = { Text(course, fontSize = 10.sp) }
                )
            }
        }
        
        TextButton(
            onClick = onClear,
            modifier = Modifier.align(Alignment.End)
        ) {
            Text("Clear Filters")
        }
    }
}

@Composable
fun MenuItemCard(item: MenuItem, onDelete: () -> Unit, onEdit: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(item.name, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                Text(item.course, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.primary)
                Text(item.description, style = MaterialTheme.typography.bodyMedium, maxLines = 1)
                Text("R%.2f".format(item.price), fontWeight = FontWeight.SemiBold, color = Color(0xFF388E3C))
            }
            IconButton(onClick = onEdit) {
                Icon(Icons.Default.Edit, contentDescription = "Edit", tint = MaterialTheme.colorScheme.primary)
            }
            IconButton(onClick = onDelete) {
                Icon(Icons.Default.Delete, contentDescription = "Delete", tint = MaterialTheme.colorScheme.error)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MenuEntryDialog(
    initialItem: MenuItem? = null,
    onDismiss: () -> Unit,
    onConfirm: (MenuItem) -> Unit
) {
    var name by remember { mutableStateOf(initialItem?.name ?: "") }
    var description by remember { mutableStateOf(initialItem?.description ?: "") }
    var course by remember { mutableStateOf(initialItem?.course ?: "Starter") }
    var price by remember { mutableStateOf(initialItem?.price?.toString() ?: "") }
    var errorMessage by remember { mutableStateOf("") }
    
    var expanded by remember { mutableStateOf(false) }
    val courses = listOf("Starter", "Main Course", "Dessert")

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(if (initialItem == null) "Add Menu Item" else "Edit Menu Item") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                if (errorMessage.isNotEmpty()) {
                    Text(errorMessage, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
                }
                OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Name") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = description, onValueChange = { description = it }, label = { Text("Description") }, modifier = Modifier.fillMaxWidth())
                
                ExposedDropdownMenuBox(
                    expanded = expanded,
                    onExpandedChange = { expanded = !expanded }
                ) {
                    OutlinedTextField(
                        value = course,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Course") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                        modifier = Modifier.menuAnchor().fillMaxWidth()
                    )
                    ExposedDropdownMenu(
                        expanded = expanded,
                        onDismissRequest = { expanded = false }
                    ) {
                        courses.forEach { selectionOption ->
                            DropdownMenuItem(
                                text = { Text(selectionOption) },
                                onClick = {
                                    course = selectionOption
                                    expanded = false
                                }
                            )
                        }
                    }
                }
                
                OutlinedTextField(
                    value = price,
                    onValueChange = { price = it },
                    label = { Text("Price (R)") },
                    modifier = Modifier.fillMaxWidth(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal)
                )
            }
        },
        confirmButton = {
            Button(onClick = {
                val priceDouble = price.toDoubleOrNull()
                if (name.isBlank() || priceDouble == null || priceDouble < 0) {
                    errorMessage = "Please enter valid name and positive price"
                } else {
                    val item = initialItem?.copy(name = name, description = description, course = course, price = priceDouble)
                        ?: MenuItem(name = name, description = description, course = course, price = priceDouble)
                    onConfirm(item)
                }
            }) {
                Text("Save")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel") }
        }
    )
}
