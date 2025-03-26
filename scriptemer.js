function searchContact() {
    let input = document.getElementById('search').value.toLowerCase();
    let contacts = document.querySelectorAll('.contact');

    contacts.forEach(contact => {
        let type = contact.getAttribute('data-type');
        if (type.includes(input) || input === "") {
            contact.style.display = "flex";
        } else {
            contact.style.display = "none";
        }
    });
}
