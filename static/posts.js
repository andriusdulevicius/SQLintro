console.log('postai');
const ul = document.getElementById('main-ul');
const idOpt = document.getElementById('post_id');

const allPosts = async () => {
  const res = await fetch('http://localhost:3000/post');
  const result = await res.json();

  result.map((p) => {
    const li = document.createElement('li');
    li.innerHTML = `<li><a href="/post/${p.id}">Post ${p.id}</a>
    <div>Title: ${p.title}</div>
    <div>Body: ${p.body}</div>
    <div>CreatedAt: ${p.created_at}</div>
    </li>`;
    ul.append(li);
  });
  result.map((p) => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.innerHTML = `${p.title} ${p.id}`;

    idOpt.append(opt);
  });
};

allPosts();
