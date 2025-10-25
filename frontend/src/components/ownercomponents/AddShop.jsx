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
import { useForm } from "react-hook-form";
import { CiSquarePlus } from "react-icons/ci";
import axios from "axios";
import { server } from "@/helpers/constants";
import { SpinnerCustom } from "../spinner";

const shopSchema = z.object({
    name: z.string().min(2, "Name is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    address: z.string().min(5, "Address is required"),
    // ✅ Make image optional for edit
    image: z
        .any()
        .optional()
        .refine((file) => !file || file instanceof File, "Invalid file")
        .refine((file) => !file || file.type?.startsWith("image/"), "Only image files are allowed"),

});

export function AddShop({ refreshShops, showData }) {
    const shop = Array.isArray(showData) ? showData[0] : showData;
    const [open, setOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loader, setLoader] = useState(false);

    const isEditMode = Boolean(showData); // if props exist, we are editing

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: zodResolver(shopSchema),
        defaultValues: showData || {}
    });
    
    // ✅ Prefill form when showData is available
    useEffect(() => {

        if (isEditMode && shop) {
          
            setValue("name", shop.name ||"");
            setValue("city", shop.city ||"");
            setValue("state", shop.state ||"");
            setValue("address", shop.address ||"");
            setPreviewUrl(shop.image ||"") ; // existing image preview
        }
    }, [isEditMode, shop, setValue]);

    // Handle file change
    const onFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("image", file); // update react-hook-form state
            setPreviewUrl(URL.createObjectURL(file)); // show new image
        }
    };

const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("address", data.address);

    // Append image if new one uploaded
    if (data.image instanceof File) {
        formData.append("image", data.image);
    }

    // Append shopId if editing
    if (isEditMode && shop?._id) {
        formData.append("shopId", shop._id);
    }

    try {
        setLoader(true);

        // POST for both create and edit
        const res = await axios.post(`${server}/api/shop/create-edit`, formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data) {
            refreshShops();
            setPreviewUrl(null);
            setOpen(false);
            reset();
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
                    {isEditMode ? "Edit Shop" : "Add Shop"}
                    <CiSquarePlus color="#fff" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{isEditMode ? "Edit Shop" : "Add Shop"}</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid flex-1 auto-rows-min gap-6 px-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register("name")} />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" {...register("city")} />
                        {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" {...register("state")} />
                        {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" {...register("address")} />
                        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="image">Upload Image</Label>
                        <Input id="image" type="file" accept="image/*" onChange={onFileChange} />
                        {previewUrl && <img src={previewUrl} alt="preview" className="max-h-20 rounded" />}
                        {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
                    </div>
                    <SheetFooter>
                        <Button type="submit">{isEditMode ? "Edit Shop" : "Add Shop"}</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
