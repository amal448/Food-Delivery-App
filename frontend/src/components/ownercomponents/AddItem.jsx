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
  address: z.string().min(5, "Address is required"),
  image: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File, "Invalid file")
    .refine(
      (file) => !file || file.type?.startsWith("image/"),
      "Only image files are allowed"
    ),
});

export function AddItem({ refreshShops }) {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loader, setLoader] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shopSchema),
    defaultValues:  {},
  });



  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ✅ Submit handler
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("foodType", data.foodType);
    formData.append("address", data.address);

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }


    try {
      setLoader(true);
      const res = await axios.post(`${server}/api/item/add-item`, formData, {
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
          Add Item <CiSquarePlus color="#fff" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle> Add Item</SheetTitle>
          <SheetDescription>
            Add a new item to your shop.
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
            {/* <Input id="category" {...register("category")} /> */}

            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <SelectSearch data={category} value={field.value} onChange={field.onChange} />
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
            {/* <Input id="foodType" {...register("foodType")} /> */}
            <Controller
              name="foodType"
              control={control}
              render={({ field }) => (
                <SelectSearch data={FoodItem} value={field.value} onChange={field.onChange} />
              )}
            />


            {errors.foodType && (
              <p className="text-red-500 text-sm">{errors.foodType.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="image">Upload Image</Label>
            <Input id="image" type="file" accept="image/*" onChange={onFileChange} />
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
              Add Item
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
