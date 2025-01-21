import { apiSlice } from "./apiSlice.js";
import {CATEGORY_URL} from "../features/constants.js";


export const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({
        createCategory: builder.mutation({
            query:(newCategoryData) =>({
                url : `${CATEGORY_URL}`,
                method  : "POST",
                body : newCategoryData,
            })
        }),

        updateCategory : builder.mutation({
            query: ({categoryId, updateCategory}) => ({
                url : `${CATEGORY_URL}/${categoryId}`,
                method : "PUT",
                body : updateCategory
            })
        }),

        deleteCategory : builder.mutation({
            query : (categoryId) => ({
                url : `${CATEGORY_URL}/${categoryId}`,
                method : "DELETE"
            })
        }),

        fetchCategories : builder.query({
            query : () => ({
                url : `${CATEGORY_URL}/categories`,
                method : "GET",

            }),
        }),



    })
});

export const{ 
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
    useFetchCategoriesQuery,
    useUpdateCategoryMutation
} = categoryApiSlice


