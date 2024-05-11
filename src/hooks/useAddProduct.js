import { useState, useContext } from 'react';
import firebase from "firebase";
import { AuthContext } from '../context/AuthContext'; // AuthContext'in bulunduğu yolu doğru şekilde belirtin
import toast from "react-hot-toast";

const useAddProduct = () => {
    const { user } = useContext(AuthContext); // AuthContext'i kullanarak mevcut kullanıcıyı alın
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [price, setPrice] = useState('');
    const db = firebase.firestore();

    const addProduct = async () => {
        // Kullanıcının giriş yapıp yapmadığını kontrol edin
        if (!user) {
            toast.error("Kullanıcı giriş yapmadı. Ürün eklemek için giriş yapmalısınız.");
            return;
        }

        console.log("addProduct fonksiyonu çağrıldı");

        try {
            const beveragesRef = db.collection('restaurant').doc('001').collection('menus').doc('en').collection('categories').doc('beverages');

            // Yeni ürünü oluştur
            const newProduct = {
                name,
                description,
                imageUrl,
                ingredients,
                price
            };

            // beverages dökümanını kontrol et
            const doc = await beveragesRef.get();

            if (!doc.exists) {
                // Eğer beverages dökümanı mevcut değilse, bu dökümanı oluştur ve items alanını bir array olarak başlat
                await beveragesRef.set({ items: [newProduct] });
            } else {
                // Eğer beverages dökümanı mevcut ise, items array'ine yeni bir ürün ekle
                await beveragesRef.update({
                    items: firebase.firestore.FieldValue.arrayUnion(newProduct)
                });
            }

            console.log("Ürün başarıyla eklendi");

            // Başarıyla eklendiğinde state'i sıfırla
            setName('');
            setDescription('');
            setImageUrl('');
            setIngredients('');
            setPrice('');
        } catch (error) {
            console.error("Ürün eklenirken bir hata oluştu: ", error);
        }

        console.log("addProduct fonksiyonu tamamlandı");
    };

    return { addProduct, setName, setDescription, setImageUrl, setIngredients, setPrice };
};

export default useAddProduct;