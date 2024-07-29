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

let currentNotificationKey = null;

document.getElementById('notification-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const notificationText = document.getElementById('notification-text').value;
    const notificationDate = document.getElementById('notification-date').value;
    const notificationFile = document.getElementById('notification-file').files[0];
    const progressBar = document.getElementById('upload-progress');

    if (notificationText && notificationDate) {
        if (notificationFile) {
            const storageRef = storage.ref('notifications/' + notificationFile.name);
            const uploadTask = storageRef.put(notificationFile);

            progressBar.style.display = 'block';

            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    progressBar.value = progress;
                }, 
                (error) => {
                    console.error("Upload failed: ", error);
                }, 
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        saveNotification(notificationText, notificationDate, downloadURL);
                        progressBar.style.display = 'none';
                        progressBar.value = 0;
                        location.reload(); // Reload the page after saving the notification
                    });
                }
            );
        } else {
            saveNotification(notificationText, notificationDate, null);
            location.reload(); // Reload the page after saving the notification
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

function showNotification(notification, key) {
    const notificationElement = document.createElement('div');
    notificationElement.className = 'notification';
    notificationElement.innerHTML = `
        <p>${notification.text}</p>
        <p>${new Date(notification.date).toLocaleString()}</p>
        ${notification.fileURL ? `<a href="${notification.fileURL}" download="${notification.fileURL.split('/').pop()}">Download Attachment</a>` : ''}
        <button onclick="editNotification('${key}')">Edit</button>
        <button onclick="deleteNotification('${key}')">Delete</button>
    `;
    document.getElementById('notification-area').appendChild(notificationElement);
}

function editNotification(key) {
    const notificationRef = database.ref('notifications/' + key);
    notificationRef.once('value', snapshot => {
        const notification = snapshot.val();
        document.getElementById('notification-text').value = notification.text;
        document.getElementById('notification-date').value = new Date(notification.date).toISOString().substring(0, 16);
        document.getElementById('notification-file').value = ''; // Clear the file input
        currentNotificationKey = key;
        document.getElementById('update-button').style.display = 'inline';
        document.getElementById('notification-form').onsubmit = function(e) {
            e.preventDefault();
            updateNotification();
        };
    });
}

function updateNotification() {
    const notificationText = document.getElementById('notification-text').value;
    const notificationDate = document.getElementById('notification-date').value;
    const notificationFile = document.getElementById('notification-file').files[0];
    const progressBar = document.getElementById('upload-progress');

    if (notificationText && notificationDate) {
        if (notificationFile) {
            const storageRef = storage.ref('notifications/' + notificationFile.name);
            const uploadTask = storageRef.put(notificationFile);

            progressBar.style.display = 'block';

            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    progressBar.value = progress;
                }, 
                (error) => {
                    console.error("Upload failed: ", error);
                }, 
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        saveUpdatedNotification(currentNotificationKey, notificationText, notificationDate, downloadURL);
                        progressBar.style.display = 'none';
                        progressBar.value = 0;
                        document.getElementById('update-button').style.display = 'none';
                        currentNotificationKey = null;
                        location.reload(); // Reload the page after updating the notification
                    });
                }
            );
        } else {
            saveUpdatedNotification(currentNotificationKey, notificationText, notificationDate, null);
            document.getElementById('update-button').style.display = 'none';
            currentNotificationKey = null;
            location.reload(); // Reload the page after updating the notification
        }
        document.getElementById('notification-text').value = '';
        document.getElementById('notification-date').value = '';
        document.getElementById('notification-file').value = '';
        document.getElementById('notification-form').onsubmit = function(e) {
            e.preventDefault();
            const notificationText = document.getElementById('notification-text').value;
            const notificationDate = document.getElementById('notification-date').value;
            const notificationFile = document.getElementById('notification-file').files[0];
            const progressBar = document.getElementById('upload-progress');
            // Revert back to the original form submit handler
            if (notificationText && notificationDate) {
                if (notificationFile) {
                    const storageRef = storage.ref('notifications/' + notificationFile.name);
                    const uploadTask = storageRef.put(notificationFile);

                    progressBar.style.display = 'block';

                    uploadTask.on('state_changed', 
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            progressBar.value = progress;
                        }, 
                        (error) => {
                            console.error("Upload failed: ", error);
                        }, 
                        () => {
                            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                saveNotification(notificationText, notificationDate, downloadURL);
                                progressBar.style.display = 'none';
                                progressBar.value = 0;
                                location.reload(); // Reload the page after saving the notification
                            });
                        }
                    );
                } else {
                    saveNotification(notificationText, notificationDate, null);
                    location.reload(); // Reload the page after saving the notification
                }
                document.getElementById('notification-text').value = '';
                document.getElementById('notification-date').value = '';
                document.getElementById('notification-file').value = '';
            }
        };
    }
}

function saveUpdatedNotification(key, text, date, fileURL) {
    database.ref('notifications/' + key).update({
        text: text,
        date: date,
        fileURL: fileURL
    });
}

function deleteNotification(key) {
    database.ref('notifications/' + key).remove();
    document.getElementById('notification-area').innerHTML = ''; // Clear notifications
    loadNotifications(); // Reload notifications
}

function loadNotifications() {
    database.ref('notifications').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            const notification = childSnapshot.val();
            const key = childSnapshot.key;
            showNotification(notification, key);
        });
    });
}

loadNotifications();

//Blogigng system


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const form = document.getElementById('new-book-form');
const postsList = document.getElementById('Book-list');

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
    }

    if (imageInput.files.length > 0) {
        const image = imageInput.files[0];
        const storageRef = storage.ref('images/' + image.name);
        await storageRef.put(image);
        imageUrl = await storageRef.getDownloadURL();
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

ocument.addEventListener("DOMContentLoaded", function() {
    const rssFeedUrl = 'https://odia.oneindia.com/rss/feeds/oneindia-odia-fb.xml'; // Replace with your desired RSS feed URL
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

//Login New
