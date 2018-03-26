(function () {
    var foo = 'bar';
    var comments;
    var like_btn = document.getElementById('like-btn');
    var lc_field = document.getElementById('like-count');
    var comment_btn = document.getElementById('comment-btn');
    var form_box = document.getElementById('form-box');
    var form_element = document.getElementById('form-comment');
    var comments_disp_box = document.getElementById('comments-disp-box');

    // Initialise sessions
    if (!localStorage.getItem('likes')) {
        populate_storage();
    }
    // Initialise comments
    comments = JSON.parse(localStorage.getItem('comments'));

    // Initialise functions
    comment_toggle(comment_btn, form_box);
    track_like_count(like_btn, lc_field);
    display_comments(comments_disp_box, comments);
    form_comment(form_element, comments, comments_disp_box);

    // Reset session to default
    document.getElementById('del_session')
            .addEventListener('click', delete_storage, false);
})()

// track_like_count -> modify_count
function set_like_count(element, c) {
    element.innerHTML = c;
}

function track_like_count(btn, field) {
    var c = parseInt(localStorage.getItem('likes'));
    set_like_count(field, c);
    btn.addEventListener('click', () => c = modify_count(c, field), false);
}

function modify_count(c, field) {
    c = c + 1;
    update_storage('likes', c);
    set_like_count(field, c);
    return c;
}

// comment_toggle -> handle_comment_toggle
function comment_toggle(element, f) {
    element.addEventListener('click', () => handle_comment_toggle(f), false);
}

function handle_comment_toggle(f) {
    var form_box = f.classList;
    console.log(form_box);
    if (form_box.contains('d-none')) {
        form_box.remove('d-none');
    } else {
        form_box.add('d-none');
    }
    if (form_box.contains('d-block')) {
        form_box.remove('d-block');
    } else {
        form_box.add('d-block');
    }
}



function display_comments(parent, comments) {
    for (var i = 0; i < comments.length; i++) {
        create_comment(parent, comments[i], false);
    }
}

function create_comment(parent, comment) {
    var container = document.createElement('div')
    container.classList.add('pb-1')
    container.classList.add('mb-1')

    var comment_element = document.createElement('div')
    comment_element.classList.add('lead')
    comment_element.classList.add('small')
    comment_element.innerHTML = comment['value']
    container.insertAdjacentElement('afterbegin', comment_element);

    var author = document.createElement('a')
    var href = document.createAttribute('href')
    href.value = '#'
    author.innerHTML = comment['author']
    author.setAttributeNode(href)
    author.classList.add('small')
    container.insertAdjacentElement('beforeend', author);

    var time = document.createElement('span')
    var badge_classes = "badge badge-pill badge-info float-right".split(" ")
        .forEach(element => time.classList.add(element));
    time.innerHTML = comment['time']

    author.insertAdjacentElement('afterend', time);

    parent.insertAdjacentElement('afterbegin', container);
}

function form_comment(element, comments, position) {
    var comment = {};
    element.addEventListener('submit', function () {
        comment.value = element.elements[0].value;
        comment.author = 'Anonymous';
        // Add current timestamp
        comment.time = new Date().toISOString()
                            .replace(/T/, ' ')
                            .replace(/\..+/, '');
        comments.push(comment);
        console.log(comments);
        update_storage('comments', JSON.stringify(comments));
        create_comment(position, comment);
        return false;
    })
}

// sessions
function populate_storage() {
    var comments = [{
            value: "Deserunt reiciendis aliquid enim ad?",
            author: "John Doe",
            time: "2018-03-26 20:00:04",
        },
        {
            value: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            author: "Anonymous",
            time: "1498-01-01 00:00:01"
        }
    ];
    localStorage.setItem('likes', 0)
    localStorage.setItem('comments', JSON.stringify(comments))
}

function update_storage(key, value) {
    localStorage.setItem(key, value);
}

function delete_storage() {
    localStorage.clear();
    window.location.reload(true);
}