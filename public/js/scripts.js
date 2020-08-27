const currentPage = location.pathname;
const menuItens = document.querySelectorAll(".menu a");
const form = document.querySelector("form#delete");

for (const item of menuItens) {
    if (currentPage == (item.getAttribute("href"))) {
        item.classList.add("active");
        item.parentNode.parentNode.querySelector("a").classList.add("active");
    }
}

function paginate(selectedPage, totalPages) {
    let pages = [],
        oldPage;
  
    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2;
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 2;
    
        if (firstAndLastPage || pagesAfterSelectedPage && pagesBeforeSelectedPage) {
            if (oldPage && currentPage - oldPage > 2) pages.push("...");
            if (oldPage && currentPage - oldPage == 2) pages.push(currentPage - 1);
    
            pages.push(currentPage);
            oldPage = currentPage;
        }
    }
  
    return pages;
}
  
function createPagination(pagination) {
    const filter = pagination.dataset.filter;
    const page = +pagination.dataset.page;
    const total = +pagination.dataset.total;
    const pages = paginate(page, total);
  
    let elements = "";
  
    for (let page of pages) {
        if (String(page).includes("...")) {
            elements += `<span>${page}</span>`;
        
        } else {
            if (filter) {
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`;
            } else {
                elements += `<a href="?page=${page}">${page}</a>`;
            }
        }
    }
  
    pagination.innerHTML = elements;
}
  
const pagination = document.querySelector('.pagination');
if (pagination) createPagination(pagination);

if (form) {
    const formDelete = document.querySelector("#delete");
    formDelete.addEventListener("submit", (e) => {
        const confirmation = confirm("Deseja realmente deletar?");
        if (!confirmation) e.preventDefault();
    });
}

const Toggle = {
    input: "",

    toggleButton(e) {
        Toggle.input = e.target;

        if (Toggle.input.innerHTML == "ESCONDER") {
                Toggle.input.innerHTML = "MOSTRAR";

                const parent = Toggle.input.parentElement.parentElement.querySelector(".toggle-content");
                parent.classList.add("hide");

        } else {

                Toggle.input.innerHTML = "ESCONDER";

                const parent = Toggle.input.parentElement.parentElement.querySelector(".toggle-content");
                parent.classList.remove("hide");
        }
    }
}

const addFields = {
    input: "",
    parent: "",
    container: "",

    add(e) {
        addFields.input = e.target;
        addFields.parent = addFields.input.parentElement;
        addFields.container = addFields.parent.querySelector(".field").lastElementChild;

        const newField = addFields.container.cloneNode(true);
        if (newField.children[0].value === "") return;

        newField.children[0].value = "";
        addFields.parent.querySelector(".field").appendChild(newField);
    },

    remove(e) {
        addFields.input = e.target;
        addFields.parent = addFields.input.parentElement.parentElement;
    
        if (addFields.parent.parentElement.children.length > 1) {
            if (addFields.parent.querySelector('input').value == "") {
                return;
            } else {
                addFields.parent.parentElement.removeChild(addFields.parent);
            }
        }
    }
}

const ImagesUpload = {
    input: "",
    preview: document.querySelector("#images-preview"),
    uploadLimit: 5,
    path: "",
    files: [],
        
    handleFileInput(e) {
        const { files: fileList } = e.target;
        ImagesUpload.input = e.target;

        if (ImagesUpload.hasLimit(e)) return;

        Array.from(fileList).forEach(file => {
            ImagesUpload.files.push(file);
            const reader = new FileReader();

            reader.onload = () => {
                const image = new Image();
                image.src = String(reader.result);
                const container = ImagesUpload.getContainer(image);
                ImagesUpload.preview.appendChild(container);
            }
                    
            reader.readAsDataURL(file);
        });
        
        ImagesUpload.input.files = ImagesUpload.getAllFiles();
    },

    hasLimit(e) {
        const { uploadLimit, input, preview } = ImagesUpload;
        
        const { files: fileList } = input;
        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`);
            e.preventDefault();
            return true;
        }

        const container = [];
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "image") container.push(item);
        });

        const totalPhotos = fileList.length + container.length;
        if (totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos");
            e.preventDefault();
            return true;
        }

        return false;
    },
    
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer();
        ImagesUpload.files.forEach(file => dataTransfer.items.add(file));
        return dataTransfer.files;
    },
    
    getContainer(image) {
        const container = document.createElement("div");
        container.classList.add("image");
        container.onclick = ImagesUpload.removeImage;

        container.appendChild(image);
        container.appendChild(ImagesUpload.getRemoveButton());
        return container;
    },
    
    getRemoveButton() {
        const button = document.createElement("i");
        button.innerHTML = "×";
        return button;
    },
    
    removeImage(e) {
        const container = e.target.parentNode;
        const imagesArray = Array.from(ImagesUpload.preview.children);
        const index = imagesArray.indexOf(container);

        ImagesUpload.files.splice(index, 1);
        ImagesUpload.input.files = ImagesUpload.getAllFiles();
        container.remove();
    },
    
    removeOldImage(e) {
        const container = e.target.parentNode;
            
        if (container.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]');
            if (removedFiles) removedFiles.value += `${container.id},`;
        }

        container.remove();    
    }
}
    
const Selected = {
    mainPhoto: document.querySelector(".img img"),
    highlights: document.querySelectorAll(".highlights img"),

    highlightPhoto(e) {
        const selected = e.target;
    
        for (image of Selected.highlights) {
            image.classList.remove("selected");
        }
    
        selected.classList.add("selected");
    
        Selected.mainPhoto.src = selected.src;
        Selected.mainPhoto.alt = selected.alt;
    }
}

const Validate = {
    apply(input, func) {
        Validate.clearErrors(input);
        
        let results = Validate[func](input.value);
        input.value = results.value;

        if (results.error) Validate.displayError(input, results.error);
    },

    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector(".error");
        if (errorDiv) errorDiv.remove();
    },

    displayError(input, error) {
        const div = document.createElement('div');
        div.classList.add('error');
        div.innerHTML = error;

        input.parentNode.appendChild(div);
        input.focus();
    },

    isEmail(value) {
        let error = null;
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        
        if (!value.match(mailFormat)) error = "Email inválido";
        return { error, value };
    }
}
