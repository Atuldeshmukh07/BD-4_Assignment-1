import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
app.use(cors());
app.use(express.json());

let db;
(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

// Exercise 1: Get All Restaurants.

async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurant: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let result = await fetchAllRestaurants();
    if (result.restaurant.length === 0) {
      return res.status(404).json({ message: 'No restaurants found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 2: Get Restaurant by ID.

async function fetchRestaurantsById(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.all(query, [id]);
  return { restaurant: response };
}

app.get('/restaurants/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let result = await fetchRestaurantsById(id);
    if (result.restaurant === undefined) {
      return res
        .status(404)
        .json({ message: 'No restaurants found for this id: ' + id });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 3: Get Restaurants by Cuisine.

async function fetchRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let result = await fetchRestaurantsByCuisine(cuisine);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No restaurants found for this cuisine: ' + cuisine });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 4: Get Restaurants by Filter.

async function getRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  try {
    let result = await getRestaurantsByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No restaurants found as your requirement.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 5: Get Restaurants Sorted by Rating.

async function fetchRestaurantsByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let result = await fetchRestaurantsByRating();
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 6: Get All Dishes.

async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  try {
    let result = await fetchAllDishes();
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 7: Get Dish by ID.

async function fetchDishesById(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.all(query, [id]);
  return { dishes: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let result = await fetchDishesById(id);
    if (result.dishes === undefined) {
      return res
        .status(404)
        .json({ message: 'No dishes found for this id: ' + id });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 8: Get Dishes by Filter.

async function getDishesByFilter(isVeg) {
  let query = 'SELECT * FROM restaurants WHERE isVeg = ?';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  try {
    let result = await getDishesByFilter(isVeg);
    if (result.dishes.length === 0) {
      return res
        .status(404)
        .json({ message: 'No dishes found as your requirement.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 9: Get Dishes Sorted by Price.

async function SortDishesByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price ASC';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let result = await SortDishesByPrice();
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No Dishe found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Express server initialized');
});
