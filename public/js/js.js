


// Компонент один товар в каталоге

Vue.component('item-component', {
    props: ['item'],
    template: `
                     <div class="product-container"><a href="#" class="product-link">
                            <img :src="item.imgURL" alt="" class="product-img">
                            <div class="item-text">
                                <p class="prod-p0">{{item.name}}</p>
                                <p class="prod-p">\${{item.price}}.00</p>
                            </div>
                        </a>
                        <div class="cart-box"><a @click.prevent="buyItemHandler(item)" class="cart-box-a" href="#"><img class="cart-white" 
                        src="images/cart-white.svg" alt="">Add to cart</a></div>
                    </div>
    `,
    methods: {
        buyItemHandler(item) {
            this.$emit('buyitemclick', item);
        },
    },
});


// Компонент списка товаров в каталоге

Vue.component('items-list-component', {
    props: ['filtereditemslist'],
    template: `
        <div class="product-view">
            <item-component v-for="item in filtereditemslist" @buyitemclick="buyItemClick"
            :item="item"></item-component>
        </div>
    `,
    methods: {
        buyItemClick(item) {
            this.$emit('cartchange', item);
        }
    }
});


// Элемент корзины

Vue.component('cart-item-component', {
    props: ['item'],
    template: `
        <div class="cart-item">
                <div class="cart-img">
                    <img style="height: 120px" :src="item.imgURL" alt="Item">
                    <div class="cart-img-text">
                        <h3 class="item-h3">{{item.name}}</h3>
                        <p class="item-p"><span class="item-p-bold">Color:</span> Red</p>
                        <p class="item-p"><span class="item-p-bold">Size:</span> Xll</p>
                    </div>
                </div>
                <div class="cart-columns">
                    <div class="cart-col">$ {{item.price}}</div>
                    <div class="cart-col">
                        <div @click="subOne(item)" class="cart-add-button">-</div>
                    <span class="quant">{{item.quantity}}</span>
                        <div @click="addOne(item)" class="cart-add-button">+</div>
                    </div>
                    <div class="cart-col">FREE</div>
                    <div class="cart-col">$ {{itemSum}}</div>
                    <div class="cart-col"><a @click.prevent="deleteHandler(item)" href="#"><img class="cart-cross" src="images/cart-cross.png" alt=""></a></div>
                </div>
            </div>
    `,
    computed: {
        itemSum() {
            return this.item.price * this.item.quantity;
        }
    },
    methods: {
        deleteHandler(item) {
            this.$emit('on-del', item);
        },
        addOne(item) {
            this.$emit('on-add', item);
        },
        subOne(item) {
            this.$emit('on-sub', item);
        }
    }
});


// Список элементов корзины

Vue.component('cart-list-component', {
    props: ['cartitems'],
    template: `
        <div>
            <cart-item-component 
            @on-del="deleteHandler(item)"
            @on-add="addOne"
            @on-sub="subOne"
            v-for="item in cartitems" :item="item"></cart-item-component>
        </div>
    `,
    methods: {
        deleteHandler(item) {
            this.$emit('on-del', item);
        },
        addOne(item) {
            this.$emit('on-add', item);
        },
        subOne(item) {
            this.$emit('on-sub', item);
        }
    },
});

// Компонент регистации/входа
Vue.component('registration-enter-component', {
    props: [],
    data() {
        return {
            displayRegForm: 'none',
            displayEnterForm: 'block',
            user: {
                name: '',
                pass: '',
                email: ''
            }
        }
    },
    template: `
     <div class="login-page">
                         <div class="wrong-form-message"></div>
        <div class="form">
            <form :style="{display: displayRegForm}" class="register-form">
                <input v-model="user.name" type="text" placeholder="name"/>
                <input v-model="user.pass" type="password" placeholder="password"/>
                <input v-model="user.email" type="email" placeholder="email address"/>
                <button @click.prevent="createUserHandler">create</button>
                <p class="message">Already registered? <a @click.prevent="changeAccFormHandler" href="#">Sign In</a></p>
            </form>
            <form :style="{display: displayEnterForm}" class="login-form">
                <input v-model="user.name" type="text" placeholder="username"/>
                <input v-model="user.pass" type="password" placeholder="password"/>
                <button @click.prevent="loginUserHandler">login</button>
                <p class="message">Not registered? <a @click.prevent="changeAccFormHandler" href="#">Create an account</a></p>
            </form>
        </div>
    </div>
    `,

    methods: {
        // Переключение формы регистрации/входа
        changeAccFormHandler() {
            document.querySelector('.wrong-form-message').innerHTML = '';
            this.user.name = '';
            this.user.pass = '';
            this.displayEnterForm == 'block' ? this.displayEnterForm = 'none' : this.displayEnterForm = 'block';
            this.displayRegForm == 'none' ? this.displayRegForm = 'block' : this.displayRegForm = 'none';
        },
        createUserHandler() {
            if(this.validationName() && this.validationPass() && this.validationEmail()) {
                fetch('http://localhost:3000/users', {
                    method: 'POST',
                    body: JSON.stringify(this.user),
                    headers: {'Content-Type': 'application/json'},
                }).then(response => response.json())
                    .then(user => {
                        this.$emit('new-user', user);
                    });
            }
        },
        loginUserHandler() {
            if(this.validationName() && this.validationPass()) {

                window.location.href = "index.html";
            }
        },
        validationName() {
            let val = /\w{3,50}/i;
            let msg = document.querySelector('.wrong-form-message');
            let test = val.test(this.user.name);
            if(!test) {
                msg.innerHTML = 'Enter a name (from 3 to 50 smb)';
                return false;
            } else {
                msg.innerHTML = '';
                return true;
            }
        },
        validationPass() {
            let val = /\w{4,15}/i;
            let msg = document.querySelector('.wrong-form-message');
            let test = val.test(this.user.pass);
            if(!test) {
                msg.innerHTML = 'Enter password (from 4 to 15 smb)';
                return false;
            } else {
                msg.innerHTML = '';
                return true;
            }
        },
        validationEmail() {
            let val = /^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i;
            let msg = document.querySelector('.wrong-form-message');
            let test = val.test(this.user.email);
            if(!test) {
                msg.innerHTML = 'Enter correct E-mail';
                return false;
            } else {
                msg.innerHTML = '';
                return true;
            }
        },
    }
});


// Кнопка входа в аккаунт в шапке сайта
Vue.component('account-button-component', {
    data() {
       return {

       };
   },
    template: `
    <a @click.prevent="tryHandler" href="#" class="header-button">My Account<img src="images/header-button-arrow.png" alt="">
                </a>
    `,
    methods: {
        tryHandler() {
            //this.$root.$emit('on-bus');
            window.location.href = "registration.html";
        }
    }
});


Vue.component('personal-account-component', {

    data() {
        return {

        };
    },
    template: `
    <h1>Account Component</h1>
    `,
        methods: {
        onTryHandler(i) {
    }
},
    mounted() {
        /*this.$root.$on('on-bus',function () {
            console.log('We are in');
            window.location.href ="registration.html";
        })*/
    }
});















// Родительский объект

let app = new Vue({
    el: '#app',
    data: {
        itemslist: '',
        filtereditemslist: '',
        cart: [],
        user: {},
        name: 'Vas`ok!',
    },
    methods: {
        // Добавление товара в корзину со страницы каталога
        cartChange(item) {
            let inCart = this.cart.find(i => item.id == i.id);
            if (inCart) {
                fetch(`http://localhost:3000/cart/${inCart.id}`, {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({quantity: inCart.quantity + 1})
                }).then(response => response.json())
                    .then(updated => {
                        let indx = this.cart.findIndex(elem => elem.id === item.id);
                        Vue.set(this.cart, indx, updated);
                    })
            } else {
                fetch(`http://localhost:3000/cart`, {
                    method: 'POST',
                    body: JSON.stringify({...item, quantity: 1}),
                    headers: {'Content-Type': 'application/json'}
                }).then((response) => response.json())
                    .then((created) => this.cart.push(created))
            }
        },
        // Уменьшение количества (удаление при нулевом значении товара)
        subHandler(item) {
            if (item.quantity > 1) {
                fetch(`http://localhost:3000/cart/${item.id}`, {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({quantity: item.quantity - 1})
                }).then(response => response.json())
                    .then(updated => {
                        let indx = this.cart.findIndex(elem => elem.id === item.id);
                        Vue.set(this.cart, indx, updated);
                    })

            } else {
                fetch(`http://localhost:3000/cart/${item.id}`, {
                    method: 'DELETE',

                }).then(() => {
                    this.cart = this.cart.filter(elem => item.id !== elem.id);
                })
            }
        },

        // Удаление всей строки товара в корзине
        deleteHandler(item) {
            fetch(`http://localhost:3000/cart/${item.id}`, {
                method: 'DELETE',
            }).then(() => {
                this.cart = this.cart.filter(elem => item.id !== elem.id);
            })
        },

        // Очистка корзины целиком (не удалось выяснить как в json-server удалать весь массив объектов одной операцией)
        deleteAll() {
            fetch(`http://localhost:3000/cart`, {
                method: 'PUT',
                body: JSON.stringify({}),
                headers: {'Content-Type': 'application/json'},
            }).then(() => this.cart = []);
        },
        setNewUserHandler(user) {
            this.user = user;
        },

    },


    // Загрузка каталога и корзины
    mounted() {
        fetch(`http://localhost:3000/products`, {
            method: 'GET'
        }).then(response => response.json())
            .then(list => {
                this.itemslist = list;
                this.filtereditemslist = this.itemslist;
            });
        fetch(`http://localhost:3000/cart`, {
            method: 'GET'
        }).then(response => response.json())
            .then(list => {
                this.cart = list;
            });



    },


    computed: {
        cartTotal() {
            return this.cart.reduce((sum, item) => {
                return sum = sum + item.quantity * item.price;
            }, 0);
        }
    }


});



