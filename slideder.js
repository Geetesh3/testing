// Firebase configuration
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcwiDVr2jyTBuxs4tQu6OHvaUfL6NdJFI",
  authDomain: "physciexplained-40f47.firebaseapp.com",
  projectId: "physciexplained-40f47",
  storageBucket: "physciexplained-40f47.appspot.com",
  messagingSenderId: "724802637102",
  appId: "1:724802637102:web:6e796aa81beb6d78113ebf",
//   measurementId: "G-VY64VRCS3Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

document.addEventListener('DOMContentLoaded', () => {
    const ebookList = document.getElementById('ebook-list');
    const uploadForm = document.getElementById('upload-form');
    
    // Fetch eBooks from Firestore
    db.collection('ebooks').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const ebook = doc.data();
            const ebookItem = document.createElement('div');
            ebookItem.className = 'ebook-item';

            const title = document.createElement('h2');
            title.textContent = ebook.title;

            const author = document.createElement('p');
            author.textContent = `Author: ${ebook.author}`;

            const downloadButton = document.createElement('button');
            downloadButton.textContent = 'Download';
            downloadButton.onclick = () => downloadEbook(ebook.filename);

            ebookItem.appendChild(title);
            ebookItem.appendChild(author);
            ebookItem.appendChild(downloadButton);

            ebookList.appendChild(ebookItem);
        });
    });

    // Handle file upload
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const file = document.getElementById('file').files[0];
        
        if (file) {
            const filename = file.name;
            const storageRef = storage.ref(`ebooks/${filename}`);
            const uploadTask = storageRef.put(file);

            uploadTask.on('state_changed', (snapshot) => {
                // Optional: Handle progress updates
            }, (error) => {
                console.error('Upload failed:', error);
            }, () => {
                // Upload completed successfully
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    db.collection('ebooks').add({
                        title: title,
                        author: author,
                        filename: filename
                    }).then(() => {
                        // Clear the form
                        uploadForm.reset();
                        // Reload the eBook list
                        location.reload();
                    }).catch((error) => {
                        console.error('Error adding document:', error);
                    });
                });
            });
        }
    });
});

function downloadEbook(filename) {
    storage.ref(`ebooks/${filename}`).getDownloadURL().then((url) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }).catch((error) => {
        console.error("Error downloading eBook:", error);
    });
}