## 1. MERN stack technology

MongoDB + Express + ReactJS + NodeJS  

### Setup enviroment & tools:

- NodeJS  
- Git  
- Postman  
- MongoDB Compass (client connect to mongoDB server)  
- React developer tools for Chrome  
- Redux developer tools for Chrome  
- Node.js Modules Intellisense for VSCode  
- ES7 React/Redux/GraphQL/React-Native snippets for VSCode  

### Libraries:  

- [lodash](https://lodash.com): Thư viện JS.  
- [module-alias](https://www.npmjs.com/package/module-alias): Tạo alias cho thư mục.  
- [gravartar](https://www.npmjs.com/package/gravatar): Lấy gravatar URL đã đăng kí tại Gravatar với email.  
- [mongoose](https://mongoosejs.com/docs/api.html): Object model driver ODM hỗ trợ tương tác với DB.  
- [config](https://www.npmjs.com/package/config): Cấu hình các tham số cho ứng dụng khi chạy ở các môi trường khác nhau.  
- [bcyptjs](https://www.npmjs.com/package/bcryptjs): Mã hóa.  
- [jsonwwbtoken](https://www.npmjs.com/package/jsonwebtoken): Tạo & check token.  
- [axios](https://www.npmjs.com/package/axios): Là HTTP client dựa trên promise cho browser & nodejs.  
- [passport](https://www.passportjs.org/docs/downloads/html/): Middleware giúp authenticate.  
- [passport-jwt](https://www.npmjs.com/package/passport-jwt): Middleware giúp authenticate với jwt.  
- [validator](https://www.npmjs.com/package/validator) / [express-validator](https://express-validator.github.io/docs/) / [Joi](https://joi.dev/api/?v=17.4.2): Validate giá trị input.  
- [await-to-js](https://www.npmjs.com/package/await-to-js): Hữu ích xử lý lỗi async/await.  
- [cross-env](https://www.npmjs.com/package/cross-env): Truyền biến môi trường khi chạy command line.  
- [entities](https://www.npmjs.com/package/entities): encode & decode HTML entities.  

### Libraries for dev:  

- [nodemon](https://www.npmjs.com/package/nodemon): Tự động restart ứng dụng khi file có sự thay đổi.  
- [concurrently](https://www.npmjs.com/package/concurrently): Chạy đồng thời nhiều command.  

### Client libraries:  

- [axios](https://www.npmjs.com/package/axios): Là HTTP client dựa trên promise cho browser & nodejs.  
- [react-router-dom](https://www.npmjs.com/package/react-router-dom): DOM bindings for React router.  
- [redux](https://www.npmjs.com/package/redux): State container.  
- [react-redux](https://www.npmjs.com/package/react-redux): React bindings for Redux.  
- [redux-thunk](https://www.npmjs.com/package/redux-thunk): Thunk middleware for Redux, cho phép viết các fn tương tác với dispatch & getState của Redux store.  
- [redux-devtools-extension](https://www.npmjs.com/package/redux-devtools-extension): Theo dõi state.  
- [moment](https://www.npmjs.com/package/moment): JS date library.  
- [react-moment](https://www.npmjs.com/package/react-moment): React component for the moment date library.  
- [html-entities](https://www.npmjs.com/package/html-entities): encode & decode HTML entities.  


## 2. Joi library

Hỗ trợ validate dữ liệu:

### 1. Tạo schema:  

- **types()**: Trả về obj mà các key chứa các schema obj đã được tạo khớp với kdl tương ứng key.  

    ```js
    const {string} = Joi.types
    const schema = string.min(8) // Joi.string().min(8)
    ```  

- **any()**: Tạo schema obj khớp với bất kỳ kdl nào.  
- **string()**: Tạo schema obj khớp với kdl string.  
- **number()**: Tạo schema obj khớp với kdl number.  
- **boolean()**: Tạo schema obj khớp với kdl boolean.  
- **date()**: Tạo schema obj khớp với kdl date.  
- **array()**: Tạo schema obj khớp với kdl array.  
- **object()**: Tạo schema obj khớp với kdl object.  

```js
const schema = Joi.object().keys({
    a: Joi.string()
});
```


### 2. Tạo references

- **ref(key, [options])** hỗ trợ tạo tham chiếu, yêu cầu 2 giá trị phải bằng nhau.  

    Prefix of key: **$** (global context), **#** (local context), **/** (root).  

    ```js
    // root
    {
        x: {
            a: Joi.any(),
            b: {
                c: Joi.ref('/x.a')
            }
        }
    }

    // local context
    const schema = Joi.any()
        .warning('custom.x', { w: 'world' })
        .message({ 'custom.x': 'hello {#w}!' });

    // global context
    const schema = Joi.object({
        a: Joi.ref('b.c'),
        b: {
            c: Joi.any()
        },
        c: Joi.ref('$x')
    });

    await schema.validateAsync({ a: 5, b: { c: 5 } }, { context: { x: 5 } });
    ```

    Relative prefix:  
    >- separator prefix: **.** (self), **..** (parent - no prefix), **...** (grandparent), etc.  
    >- ancestor option: **{ancestor: number}** với number: 0 (seft), 1 (parent), etc.    

    ```js
    // separator prefix
    {
        x: {
            a: Joi.any(),
            b: {
                c: Joi.any(),
                d: Joi.ref('..'),   // Tham chiếu đến parent của nó
                e: Joi.ref('c'),    // Tham chiếu đến c là con của parent của nó (c là anh chị em của nó)
                f: Joi.ref('...a'), // Tham chiếu đến a là con của grandparent của nó (a là chú bác của nó)
                g: Joi.ref('....y')
            }
        },
        y: Joi.any()
    }

    // ancestor option
    {
        x: {
            a: Joi.any(),
            b: {
                c: Joi.any(),
                d: Joi.ref('c', { ancestor: 1 }),
                e: Joi.ref('a', { ancestor: 2 }),
                f: Joi.ref('y', { ancestor: 3 })
            }
        },
        y: Joi.any()
    }
    ```

- **in(key, [options])** hỗ trợ tạo reference mà được sử dụng như mảng các values để khớp với rule.  

    ```js
    const schema = Joi.object({
        a: Joi.array().items(Joi.number()),
        b: Joi.number().valid(Joi.in('a')) // b phải là một trong các phần tử của a
    });
    ```


### 3. Link

**link(ref)** liên kết đến another schema node, sử dụng lại nó để xác thực.  

```js
// Named links (id):
const person = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    children: Joi.array()
        .items(Joi.link('#person'))
}).id('person');

// Relative links:
const person = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    children: Joi.array().items(Joi.link('...'))
        // . - the link
        // .. - the children array
        // ... - the person object
});

// Absolute links:
const person = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    children: Joi.array().items(Joi.link('/'))
});
```


### 4. Validate

Các values sẽ được validate dựa trên *schema*, throw error nếu fail:  

```js
const schema = Joi.object({
    a: Joi.string()
});

// C1:
const { error, value } = schema.validate({ a: 'a string' });

// C2:
try {
    const value = await schema.validateAsync({ a: 'a string' });
} catch(error) {
    console.log(error)
}
```


### 4.1, assert(value, schema, [message], [options])

Validate một value dựa trên *schema*, throw error nếu fail:  

```js
Joi.assert('x', Joi.number()); // throws error
```


### 4.2, attempt(value, schema, [message], [options]) 

Validate một value dựa trên *schema*, trả về valid result, throw error nếu fail:  

```js
Joi.attempt('x', Joi.number()); // throws error
const result = Joi.attempt('4', Joi.number()); // result -> 4
```


### 5. Các method của *any* schema:  

- **empty(schema)**: Cho phép các empty value match với schema & gán undefined cho value.  
    undefined schema sẽ không áp dụng quy tắc này, mà sẽ tạo error không cho phép empty.  
- **default(value)**: Set default value cho value khi value ban đầu là undefined.  
- **failover(value)**: Set value khi value ban đầu không vượt qua validation.  
- **cast(to)**: Convert dữ liệu sang kiểu to được hỗ trợ.  

- **allow(...values)**: Xác định danh sách các value được cho phép.  
- **valid(...values)** / **equal(...values)**: Thêm các value vào danh sách được cho phép & đánh dấu chỉ các value này được coi là hợp lệ.  
- **invalid(...values)** / **not(...values)** / **disallow(...values)**: Xác định các value được coi là không hợp lệ.  
- **only()**: Yêu cầu value được xác thực phải nằm trong danh sách allow(), only + allow = valid.  

- **forbidden()**: Không cho phép bất cứ value nào ngoại trừ undefined.  
- **optional()**: Cho phép value là undefined, nhưng không cho phép null (Mặc định).  
- **required()** / **exist()**: Không cho phép value là undefined.  
- **presence(mode)**: Đặt chế độ mode cho schema là optional, forbidden, required.  

- **raw([enabled])**: Trả về giá trị ban đầu thay vì giá trị đã convert.  
- **strip([enabled])**: Đánh dấu key sẽ bị xóa bỏ khỏi object hoặc mảng kết quả sau khi validate.  
- **result(mode)**: Set mode là raw hay strip.  
- **stric([enabled])**: stric mode. set option convert của validate() thành false, ngăn convert dữ liệu của current key & child keys.  

- **id(id)**: Đặt id cho schema.  
- **extract(path)**: Trả về sub-schema dựa vào path.  

- **ruleset** / **$**: Bắt đầu ruleset để áp dụng nhiều tùy chọn rule. Kết thúc khi rule(), keep, message(), warn() được gọi.  
- **rule(options)**: Áp dụng 1 tập các rule cho ruleset hoặc rule cuối cùng, options: {keep, message, warn}.  
- **keep()**: tương đương rule({keep: true}).  
- **message(message)**: tương đương rule({message}).  
- **warn()**: tương đương rule({warn: true}).  
- **label(name)**: Override key name trong error message.  
- **warning(code, [context])**: Tạo cảnh báo.  

- **custom(method)**: Add a custom validation fn.  
- **error(err)**: Override default error by custom error.  
- **prefs(options)**: Ghi đè các global options của validate() cho current key hoặc sub-key.  
- **messages(messages)**: tương đương prefs({messages}).  
- **when([condition], options)**: Thêm điều kiện trong quá trình xác thực.  

- **validate(value, [options])** / **validateAsync(value, [options])**: Validate a value, return obj với các key: value, error, warning, artifacts.  
    options: {context: {}, convert: true, dateFormat, etc}  


### 6. Các method của *string* schema:  

- **alphanum()**: string chỉ chứa [a-zA-Z0-9].  
- **token()**: string chỉ chứa [a-zA-Z0-9_].  
- **creditCard()**: string phải là credit card number hợp lệ.  
- **email()**: string phải là email hợp lệ.  
- **normalize()**: string phải ở dạng chuẩn hóa unicode.  
- **pattern()** / **regex()**: string phải match với regex pattern.  

- **isoDate()**: string ở định dạng thời gian ISO 8601 hợp lệ.  
- **isoDuration()**: string ở định dạng khoảng thời gian ISO 8601 hợp lệ.  

- **length()**: chỉ định độ dài chuỗi chính xác.  
- **min()**: chỉ định độ dài chuỗi tối thiểu.  
- **max()**: chỉ định độ dài chuỗi tối đa.  
- **truncate([enabled])**: chỉ định có cắt chuỗi theo độ dài chuỗi tối đa hay không.  
- **trim([enabled])**: chỉ định có cắt bỏ khoảng trắng dư thừa ở 2 đầu chuỗi hay không.  
- **replace()**: thay thế chuỗi con match với pattern.  

- **case(direction)**: string buộc phải là lowercase hay uppercase. direction là 'upper' / 'lower'.  
- **lowercase()**: string buộc phải là lowercase, nếu không thì {convert: true} sẽ chuyển thành lowercase.  
- **uppercase()**: string buộc phải là uppercase, nếu không thì {convert: true} sẽ chuyển thành uppercase.  
- **insensitive()**: Không phân biệt chữ hoa & thường trong danh sách allow, valid & invalid.  

- **dataUri()**: string là uri hợp lệ.  
- **uri()**: string là uri hợp lệ.  
- **domain()**: string là domain hợp lệ.  
- **ip()**: string là ip hợp lệ.  


### 7. Các method của *number* schema:  

- **integer()**: number phải là số nguyên.  
- **positive()**: number phải là số dương.  
- **negative()**: number phải là số âm.  
- **less()**: number phải nhỏ hơn limit.  
- **greater()**: number phải lớn hơn limit.  
- **min()**: xác định giá trị nhỏ nhất.  
- **max()**: xác định giá trị lớn nhất.  
- **precision()**: Xác định độ chính xác sau dấu thập phân.  
- **port()**: number phải là TCP port hợp lệ.  


### 8. Các method của *boolean* schema:  

- **falsy()**: bổ sung các giá trị được convert thành false, yêu cầu options {convert:true}.  
- **truthy()**: bổ sung các giá trị được convert thành true, yêu cầu options {convert:true}.  
- **sensitive([enabled])**: so khớp các giá trị falsy & truthy được bổ sung phân biệt chữ hoa & thường.  


### 9. Các method của *date* schema:  

- **iso()**: string value phải là định dạng date ISO 8601.  
- **less()**: chỉ định date phải nhỏ hơn limit.  
- **greater()**: chỉ định date phải lớn hơn limit.  
- **min()**: chỉ định date nhỏ nhất được phép.  
- **max()**: chỉ định date lớn nhất được phép.  
- **timestamp([type])**: chỉ định kiểu timestamp là 'unix' (seconds) hay 'javascript' (miliseconds).  


### 10. Các method của *array* schema:  

- **length()**: chỉ định số lượng chính xác các phần tử của mảng.  
- **min()**: chỉ định số lượng tối đa các phần tử của mảng.  
- **max()**: chỉ định số lượng tối thiểu các phần tử của mảng.  
- **items(...types)**: chỉ định danh sách các kiểu cho phép của các phần tử của mảng.  
- **ordered(...type)**: chỉ định các phần tử của mảng theo thứ tự danh sách các kiểu.  
- **unique()**: các phần tử của mảng phải là duy nhất.  
- **sort([options])**: sắp xếp các phần tử của mảng.  
- **sparse([enabled])**: cho phép mảng chấp nhận phần tử undefined.  
- **single([enabled])**: cho phép giá trị đơn lẻ validate như thể mảng.  


### 11. Các method của *object* schema:  

- **keys(schema)**: set or extend các obj key.  
- **append(schema)**: append các obj key.  
- **and(...peers)**: Chỉ định nếu một key xuất hiện thì tất cả các key đều phải required.  
- **nand(...peers)**: Chỉ định tất cả các key KHÔNG thể cùng xuất hiện.  
- **or(...peers)**: Chỉ định một hoặc nhiều key phải required.  
- **xor(...peers)**: Chỉ định một key trong số chúng là required nhưng không phải cùng thời điểm.  
- **oxor(...peers)**: Chỉ định chỉ một key được phép nhưng không bắt buộc.  
- **with(key, ...peers)**: Chỉ định khi key hiện diện thì các key khác phải hiện diện.  
- **without(key, ...peers)**: Chỉ định khi key hiện diện thì các key khác KHÔNG được phép hiện diện.  
- **pattern(pattern, schema, [options])**: Xác định các quy tắc xác thực cho các key unknown match với pattern.  


## Ví dụ

```js
const inputSchema = Joi.object({
    email: Joi.string().exist().email(),
    password: Joi.string().exist()
})

let [err] = await to(inputSchema.validateAsync(req.body))

if (err) {
    const errDetail = err.details[0].message
    return res.status(400).json([errDetail])
}
```