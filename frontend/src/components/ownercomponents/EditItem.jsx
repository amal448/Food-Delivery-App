import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { CiSquarePlus } from "react-icons/ci";
import axios from "axios";
import { server } from "@/helpers/constants";
import { SpinnerCustom } from "../spinner";
import { SelectSearch } from "../select";
import { category, FoodItem } from "@/helpers/constants";

// ✅ Validation Schema
const shopSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.string().min(2, "Category is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(parseFloat(val)), "Price must be a number"),
  foodType: z.string().min(2, "Food Type is required"),
  image: z
  .any()
  .optional()
  .refine(
    (file) =>
      !file || file instanceof File || typeof file === "string",
    "Invalid file"
  )
  .refine(
    (file) =>
      !file ||
      (file instanceof File ? file.type?.startsWith("image/") : true),
    "Only image files are allowed"
  )


});

export function EditItem({ refreshShops, showData }) {
  const shop = Array.isArray(showData) ? showData[0] : showData;
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loader, setLoader] = useState(false);

  const isEditMode = Boolean(shop);
  // console.log("shop",shop);
  
  // ✅ Normalize default values to avoid undefined/null issues
  const defaultValues = shop
    ? {
        name: shop.name || "",
        category: shop.category || "",
        price: shop.price?.toString() || "",
        foodType: shop.foodType || "",
        image: shop.image || undefined,
      }
    :  {
      name: "",
      category: "",
      price: "",
      foodType: "",
      image: undefined,
    };;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shopSchema),
    defaultValues,
  });

  // ✅ Prefill data when editing
  useEffect(() => {
    if (isEditMode && shop) {
      setPreviewUrl(shop.image || null);
    }
  }, [isEditMode, shop]);

  // ✅ Handle file upload
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ✅ Submit handler
  const onSubmit = async (data) => {
    try {
      setLoader(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("price", data.price);
      formData.append("foodType", data.foodType);

      // Only append new file if it's a File object
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      if (isEditMode && shop?._id) {
        formData.append("shopId", shop._id);
      }

      const res = await axios.post(`${server}/api/item/edit-item/${shop._id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data) {
        refreshShops();
        reset();
        setPreviewUrl(null);
        setOpen(false);
      }
    } catch (error) {
      console.error("❌ Upload failed:", error);
    } finally {
      setLoader(false);
    }
  };

  if (loader) return <SpinnerCustom />;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          {isEditMode ? "Edit Item" : "Add Item"} <CiSquarePlus color="#fff" />
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditMode ? "Edit Item" : "Add Item"}</SheetTitle>
          <SheetDescription>
            {isEditMode
              ? "Update your item details and save."
              : "Add a new item to your shop."}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid flex-1 auto-rows-min gap-6 px-4"
        >
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="category">Category</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <SelectSearch
                  data={category}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="price">Price</Label>
            <Input id="price" {...register("price")} />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="foodType">Food Type</Label>
            <Controller
              name="foodType"
              control={control}
              render={({ field }) => (
                <SelectSearch
                  data={FoodItem}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.foodType && (
              <p className="text-red-500 text-sm">{errors.foodType.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="image">Upload Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={onFileChange}
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="preview"
                className="max-h-20 rounded-md border"
              />
            )}
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image.message}</p>
            )}
          </div>

          <SheetFooter>
            <Button type="submit">
              {isEditMode ? "Update Item" : "Add Item"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
