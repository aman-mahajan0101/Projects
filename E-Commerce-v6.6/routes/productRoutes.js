const express = require("express");
const router = express.Router();
const { isLoggedIn, validateProduct, isProductAuthor, validateReview, deleteReview, isReviewAuthor } = require("../middleware");
const { product } = require("../controllers/product");
const Product = require("../models/product");

// GET all the products from the database
router.route("/").get(product.getAllProducts).post(isLoggedIn, validateProduct, product.createProduct);

router.get("/search", isLoggedIn, product.searchProduct);

router.get("/filtered", isLoggedIn, product.filterProducts);

router.get("/new", isLoggedIn, product.createProductForm);

router.route("/:id").get(product.showProduct).patch(isLoggedIn, validateProduct, isProductAuthor, product.updateProduct).delete(isLoggedIn, isProductAuthor, product.deleteProduct);

router.get("/:id/edit", isLoggedIn, isProductAuthor, product.getEditForm);

// Add a review to particular product
router.post("/:productid/review", isLoggedIn, validateReview, product.createReview);

router.delete("/:productid/review/:reviewid", isLoggedIn, isReviewAuthor, product.deleteReview);

module.exports = router;

/*
<div class="container" role="main">
  <div class="row">
    <div class="col-md-8 col-sm-8 col-xs-12">
      <form action="/products/filtered" method="get">
        
        <input type="submit" name="filter">
        <select name="filter" id="filter">
          <option value="Choose">Choose</option>
          <option value="Price:Low to High">Price:Low to High</option>
          <option value="Price:High to Low">Price:High to Low</option>
          <option value="Ratings">Ratings</option>
        </select>
        </input>
      </form>
    </div>
*/
