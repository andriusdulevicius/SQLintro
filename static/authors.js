console.log('authors');
const ulAuthors = document.getElementById('authors-ul');
// const idOpt = document.getElementById('idOptions');

const allAuthors = async () => {
  const res = await fetch('http://localhost:3000/authors');
  const result = await res.json();

  result.map((a) => {
    const li = document.createElement('li');
    li.innerHTML = `<li><a href="/author/${a.au_id}">Author id:${a.au_id}</a>
    <div>Authors name: ${a.name}</div>
    <div>Sex: ${a.sex}</div>
    <div>Age: ${a.age}</div>
    <div>Post Id: ${a.post_id}</div>
    </li>`;
    ulAuthors.append(li);
  });
};

allAuthors();
