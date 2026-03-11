<template>
    <q-page-container>
      <q-page padding>
        <!-- Welcome Message -->
        <q-card>
          <q-card-section>
            <h3>Welcome back, User!</h3>
            <p>Here are your recipe suggestions for today.</p>
          </q-card-section>
        </q-card>

        <!-- Recipe Calendar -->
        <q-card>
          <q-card-section>
            <h4>Recipes for the Week</h4>
            <!-- Simulated Calendar with daily meals -->
            <q-item>
              <q-item-section>
                <div><strong>Breakfast:</strong> Pancakes</div>
                <div><strong>Lunch:</strong> Grilled Chicken Salad</div>
                <div><strong>Dinner:</strong> Spaghetti Bolognese</div>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>

        <!-- Recently Created Recipes -->
        <q-card>
          <q-card-section>
            <h4>Recent Recipes</h4>
            <!-- Display the most recent recipes -->
            <q-item v-for="recipe in recentRecipes" :key="recipe.id" clickable>
              <q-item-section>{{ recipe.name }}</q-item-section>
            </q-item>
          </q-card-section>
        </q-card>

        <!-- Recipes Suggested by Other Family Members -->
        <q-card>
          <q-card-section>
            <h4>Changes Proposed by Family</h4>
            <!-- Example of family member changes -->
            <q-item v-for="change in familyChanges" :key="change.id">
              <q-item-section>{{ change.name }}: {{ change.change }}</q-item-section>
            </q-item>
          </q-card-section>
        </q-card>

        <!-- Search Bar for Recipes -->
        <q-card>
          <q-card-section>
            <q-input v-model="searchQuery" label="Search Recipe by Ingredient or Name" />
            <q-btn @click="searchRecipes" label="Search" />
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
</template>

<script lang="ts">
export default {
  data() {
    return {
      drawer: true,
      searchQuery: '',
      recentRecipes: [
        { id: 1, name: 'Apple Pie' },
        { id: 2, name: 'Chicken Alfredo' },
        { id: 3, name: 'Vegan Tacos' }
      ],
      familyChanges: [
        { id: 1, name: 'John', change: 'Changed lunch to a vegetarian dish' },
        { id: 2, name: 'Anna', change: 'Added extra spices to dinner' }
      ]
    };
  },
  methods: {
    logout() {
      // Handle logout logic
    },
    goToSearch() {
      // Navigate to Search page
      this.$router.push('/search');
    },
    goToGptSearch() {
      // Navigate to Search GPT page
      this.$router.push('/search-gpt');
    },
    searchRecipes() {
      // Logic to search recipes based on searchQuery
    }
  }
};
</script>

<style scoped>
/* Custom styles */
</style>