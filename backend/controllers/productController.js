import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

const addProduct = asyncHandler(async(req, res) => {
    try {
        const {name , brand, description, price , category, quantity} = req.fields;
        
        //Validation
        switch(true){
            case !name:
                return res.json({error: "Name is required"});
            case !description:
                return res.json({error: "Description is required"});
            case !price:
                return res.json({error: "Price is required"});    
            case !quantity:
                return res.json({error: "Quantity is required"});
            case !brand:
                return res.json({error: "Brand name is Required."});
            case !category:
                return res.json({error : "Category is required"});
            
        }

        const product = new Product({...req.fields});
        await product.save();
        res.json(product);
       
    } catch (error) {
        console.error(error);
        res.status(404).json(error.message);
    }
});

const updateProductDetails = asyncHandler(async (req, res) => {
    try {
        const {name , brand, description, price , category, quantity} = req.fields;
        switch(true){
            case !name:
                return res.json({error: "Name is required"});
            case !description:
                return res.json({error: "Description is required"});
            case !price:
                return res.json({error: "Price is required"});    
            case !quantity:
                return res.json({error: "Quantity is required"});
            case !brand:
                return res.json({error: "Brand name is Required."});
            case !category:
                return res.json({error : "Category is required"});
        }

        const product = await Product.findByIdAndUpdate(req.params.id, {...req.fields}, {new: true});
        await product.save();
        res.json(product);

    } catch (error) {
        console.error(error);
        res.status(404).json({error: "Troubling to update the product."});
    }
});

const removeProduct= asyncHandler(async(req , res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        res.json(product);
        
    } catch (error) {
        console.error(error);
        res.status(404).json({error: "Problems to delete the product."});
    }
} );

const fetchProducts = asyncHandler(async(req, res) => {
    try {
        
        const pageSize = 6;
        const keyword = req.query.keyword ? {name : {$regex: req.query.keyword, $option : "i"}}
        : {};

        const count = await Product.countDocuments({...keyword});
        const products = await Product.find({...keyword}).limit({pageSize})

        res.json({products, page: 1, pages: Math.ceil(count/pageSize), hasMore : false});


    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Problem to fetch products"})
    }
});

const fetchProductsById= asyncHandler(async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            return res.status(200).json(product);
        }else{
            res.status(404).json({error: "Product not found"})
        }
    } catch (error) {
        console.error(error);
        res.status(404).json({error : "Product not found and server error"})
    }
});
const  fetchAllProduct = asyncHandler(async(req, res)=> {
    try {
        
        const  products = await Product.find({}).populate('category').limit(12).sort({createdAt : -1});
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(404).json({error : "Server errror"})
    }
});

const addProductReview = asyncHandler(async(req , res) => {
    try {
        const {rating, comment} = req.body;
        const product  = await Product.findById(req.params.id);

        if(product)
        {
            const alreadyReviewed = product.reviews.find((r) => 
                r.user.toString() === req.user._id.toString()

            );

            if(alreadyReviewed){
                res.status(400);
                throw new Error("Product already reviewed");
            }

            const review = {
                name : req.user.username,
                rating: Number(rating),
                comment, 
                user: req.user._id
            }
            
            product.reviews.push(review);
            product.numReviews = product.reviews.length;

            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) /product.reviews.length;

            await product.save();
            res.status(200).json({message: "Review added"});

        }else{
            res.status(404);
            throw new Error ("Product not found");
        }

    } catch (error) {
        console.error(error);
        res.status(404).json(error.message);
    }
});
const fetchTopProducts = asyncHandler(async (req, res) => {
    try {
      const products = await Product.find({}).sort({ rating: -1 }).limit(4);
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(400).json(error.message);
    }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
    try {
      const products = await Product.find().sort({ _id: -1 }).limit(5);
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(400).json(error.message);
    }
});

const filterProducts = asyncHandler(async(req , res) => {
    try {
        const {checked, radio} = req.body;

        let args = {}
        if(checked.length > 0) args.category = checked;
        if(radio.length) args.price = {$gte : radio[0], $lte: radio[1]}

        const products = await Product.find(args);
        res.json(products);
        
    } catch (error) {
        console.error(error);
      res.status(400).json(error.message);
    }
})

export {addProduct, updateProductDetails , removeProduct, fetchProducts , fetchProductsById, fetchAllProduct, addProductReview, fetchTopProducts , fetchNewProducts, filterProducts};
