import { useState, useContext, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useAddProduct = () => {
    const { user } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState("beverages");
    const db = firebase.firestore();
    const storage = firebase.storage();

    const getMaxProductID = async (categoryRef) => {
        const snapshot = await categoryRef.get();
        if (!snapshot.exists) return 0;

        const items = snapshot.data().items || [];
        const maxProductID = items.reduce((maxID, item) => {
            const itemID = parseInt(item.productID, 10);
            return itemID > maxID ? itemID : maxID;
        }, 0);

        return maxProductID;
    };

    const handleImageUpload = (file, onProgress) => {
        return new Promise((resolve, reject) => {
            const storageRef = storage.ref();
            const categoryRef = storageRef.child(`${category}/${file.name}`);
            const uploadTask = categoryRef.put(file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    onProgress(progress);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const addProduct = async () => {
        if (!user) {
            toast.error("Kullanıcı giriş yapmadı. Ürün eklemek için giriş yapmalısınız.");
            return;
        }

        try {
            const categoryRef = db
                .collection("restaurant")
                .doc("001")
                .collection("menus")
                .doc("en")
                .collection("categories")
                .doc(category);
            const maxProductID = await getMaxProductID(categoryRef);
            const newProductID = maxProductID + 1;

            const newProduct = {
                name,
                description,
                imageUrl,
                ingredients,
                price: Number(price),
                productID: newProductID.toString(),
            };

            const doc = await categoryRef.get();

            if (!doc.exists) {
                await categoryRef.set({ items: [newProduct] });
            } else {
                await categoryRef.update({
                    items: firebase.firestore.FieldValue.arrayUnion(newProduct),
                });
            }

            setName("");
            setDescription("");
            setImageUrl("");
            setIngredients("");
            setPrice(0);
            setCategory("beverages");
        } catch (error) {
            console.error("Ürün eklenirken bir hata oluştu: ", error);
        }
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setImageUrl("");
        setIngredients("");
        setPrice(0);
        setCategory("beverages");
    };

    return {
        addProduct,
        handleImageUpload,
        setName,
        setDescription,
        setImageUrl,
        setIngredients,
        setPrice,
        setCategory,
        resetForm,
    };
};

export default useAddProduct;
