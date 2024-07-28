const firebaseConfig = {
    apiKey: "AIzaSyDcwiDVr2jyTBuxs4tQu6OHvaUfL6NdJFI",
    authDomain: "physciexplained-40f47.firebaseapp.com",
    databaseURL: "https://physciexplained-40f47-default-rtdb.firebaseio.com",
    projectId: "physciexplained-40f47",
    storageBucket: "physciexplained-40f47.appspot.com",
    messagingSenderId: "724802637102",
    appId: "1:724802637102:web:6e796aa81beb6d78113ebf",
    measurementId: "G-VY64VRCS3Z"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const storage = firebase.storage();

document.getElementById('notification-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const notificationText = document.getElementById('notification-text').value;
    const notificationDate = document.getElementById('notification-date').value;
    const notificationFile = document.getElementById('notification-file').files[0];

    if (notificationText && notificationDate) {
        if (notificationFile) {
            const storageRef = storage.ref('notifications/' + notificationFile.name);
            storageRef.put(notificationFile).then((snapshot) => {
                snapshot.ref.getDownloadURL().then((downloadURL) => {
                    saveNotification(notificationText, notificationDate, downloadURL);
                });
            });
        } else {
            saveNotification(notificationText, notificationDate, null);
        }
        document.getElementById('notification-text').value = '';
        document.getElementById('notification-date').value = '';
        document.getElementById('notification-file').value = '';
    }
});

function saveNotification(text, date, fileURL) {
    database.ref('notifications').push({
        text: text,
        date: date,
        fileURL: fileURL
    });
}

database.ref('notifications').on('child_added', function (snapshot) {
    const notification = snapshot.val();
    const notificationElement = document.createElement('div');
    notificationElement.className = 'notification';
    notificationElement.innerHTML = `<p>${notification.text}</p><p>${new Date(notification.date).toLocaleString()}</p>`;
    if (notification.fileURL) {
        const fileLink = document.createElement('a');
        fileLink.href = notification.fileURL;
        fileLink.textContent = 'View Attachment';
        fileLink.target = '_blank';
        notificationElement.appendChild(fileLink);
    }
    document.getElementById('notification-area').appendChild(notificationElement);
});


//Blogigng system


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const form = document.getElementById('new-book-form');
const postsList = document.getElementById('Book-list');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const fileInput = document.getElementById('file');
    const imageInput = document.getElementById('image');
    let fileUrl = null;
    let imageUrl = null;

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const storageRef = storage.ref('files/' + file.name);
        await storageRef.put(file);
        fileUrl = await storageRef.getDownloadURL();
                    uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressBar.value = progress;
            }, (error) => {
                console.error(error);
            }, async () => {
                fileUrl = await storageRef.getDownloadURL();
                if (imageInput.files.length === 0) {
                    addPost(title, content, fileUrl, imageUrl);
                    form.reset();
                    progressContainer.style.display = 'none';
                }
            });
    }

    if (imageInput.files.length > 0) {
        const image = imageInput.files[0];
        const storageRef = storage.ref('images/' + image.name);
        await storageRef.put(image);
        imageUrl = await storageRef.getDownloadURL();
                uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressBar.value = progress;
            }, (error) => {
                console.error(error);
            }, async () => {
                imageUrl = await storageRef.getDownloadURL();
                if (fileInput.files.length === 0) {
                    addPost(title, content, fileUrl, imageUrl);
                    form.reset();
                    progressContainer.style.display = 'none';
                }
            });
        }

    addPost(title, content, fileUrl, imageUrl);
    form.reset();
});

function addPost(title, content, fileUrl, imageUrl) {
    const postId = database.ref().child('Books').push().key;
    const post = { title, content, fileUrl, imageUrl, id: postId };
    const updates = {};
    updates['/Books/' + postId] = post;
    database.ref().update(updates);
    renderPosts();
}

function renderPosts() {
    postsList.innerHTML = '';
    database.ref('Books').once('value', (snapshot) => {
        const posts = snapshot.val();
        for (let id in posts) {
            const post = posts[id];
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            postDiv.innerHTML = `
                <h3 class="post-title">${post.title}</h3>
                <p>${post.content}</p>
                ${post.fileUrl ? `<a href="${post.fileUrl}" download="file">Download attached file</a>` : ''}
                ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Image" style="max-width: 100%; height: 260px;">` : ''}
            `;
            postsList.appendChild(postDiv);
        }
    });
}

renderPosts();

// Blog Manage Code

//     const form = document.getElementById('new-post-form');
//     const postsList = document.getElementById('posts-list');

//     form.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const title = document.getElementById('title').value;
//         const content = document.getElementById('content').value;
//         const fileInput = document.getElementById('file');
//         const imageInput = document.getElementById('image');
//         let fileUrl = null;
//         let imageUrl = null;

//         if (fileInput.files.length > 0) {
//             const file = fileInput.files[0];
//             const storageRef = storage.ref('files/' + file.name);
//             await storageRef.put(file);
//             fileUrl = await storageRef.getDownloadURL();
//         }

//         if (imageInput.files.length > 0) {
//             const image = imageInput.files[0];
//             const storageRef = storage.ref('images/' + image.name);
//             await storageRef.put(image);
//             imageUrl = await storageRef.getDownloadURL();
//         }

//         addPost(title, content, fileUrl, imageUrl);
//         form.reset();
//     });

//     function addPost(title, content, fileUrl, imageUrl) {
//         const postId = database.ref().child('posts').push().key;
//         const post = { title, content, fileUrl, imageUrl, id: postId };
//         const updates = {};
//         updates['/posts/' + postId] = post;
//         database.ref().update(updates);
//         renderPosts();
//     }

//     function renderPosts() {
//         postsList.innerHTML = '';
//         database.ref('posts').once('value', (snapshot) => {
//             const posts = snapshot.val();
//             for (let id in posts) {
//                 const post = posts[id];
//                 const postDiv = document.createElement('div');
//                 postDiv.className = 'post';
//                 postDiv.innerHTML = `
//                     <h3 class="post-title">${post.title}</h3>
//                     <p>${post.content}</p>
//                     ${post.fileUrl ? `<a href="${post.fileUrl}" download="file">Download attached file</a>` : ''}
//                     ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Image" style="max-width: 100%; height: auto;">` : ''}
//                     <button onclick="editPost('${post.id}')">Edit</button>
//                     <button onclick="deletePost('${post.id}')">Delete</button>
//                 `;
//                 postsList.appendChild(postDiv);
//             }
//         });
//     }

//     window.editPost = (postId) => {
//         database.ref('posts/' + postId).once('value').then((snapshot) => {
//             const post = snapshot.val();
//             document.getElementById('title').value = post.title;
//             document.getElementById('content').value = post.content;
//             document.getElementById('file').value = '';
//             document.getElementById('image').value = '';

//             // Handle file and image update if necessary (not included here for simplicity)
//             form.addEventListener('submit', async (e) => {
//                 e.preventDefault();
//                 const title = document.getElementById('title').value;
//                 const content = document.getElementById('content').value;
//                 const fileInput = document.getElementById('file');
//                 const imageInput = document.getElementById('image');
//                 let fileUrl = post.fileUrl;
//                 let imageUrl = post.imageUrl;

//                 if (fileInput.files.length > 0) {
//                     const file = fileInput.files[0];
//                     const storageRef = storage.ref('files/' + file.name);
//                     await storageRef.put(file);
//                     fileUrl = await storageRef.getDownloadURL();
//                 }

//                 if (imageInput.files.length > 0) {
//                     const image = imageInput.files[0];
//                     const storageRef = storage.ref('images/' + image.name);
//                     await storageRef.put(image);
//                     imageUrl = await storageRef.getDownloadURL();
//                 }

//                 const updatedPost = { title, content, fileUrl, imageUrl, id: postId };
//                 const updates = {};
//                 updates['/posts/' + postId] = updatedPost;
//                 database.ref().update(updates);
//                 renderPosts();
//                 form.reset();
//             }, {once: true});
//         });
//     };

//     window.deletePost = (postId) => {
//         database.ref('posts/' + postId).remove();
//         renderPosts();
//     };

//     renderPosts();
// });

ocument.addEventListener("DOMContentLoaded", function() {
    const rssFeedUrl = 'https://rss.app/feeds/vDVMhvVuCJbV6HpF.xml'; // Replace with your desired RSS feed URL
    const rssFeedContainer = document.getElementById('rss-feed');

    fetch(rssFeedUrl)
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            const items = data.querySelectorAll("item");
            let html = '';

            items.forEach(el => {
                const title = el.querySelector("title").textContent;
                html += `<span class="rss-item">${title}</span> &nbsp;&nbsp;&nbsp;`;
            });

            rssFeedContainer.innerHTML = html;
        })
        .catch(err => console.error('Error fetching RSS feed:', err));
});
