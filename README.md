# BambangShop RESTful Catalog API — Hands-on Template
- **Nama:** Naurah Claradinda Aulia Pane
- **NPM:** 2506657163
- **Kelas:** PBP A
- **Mengerjakan:** Milestone 1, 2, dan 3

This directory contains the starter template for the hands-on tutorial in **Module 08: Django REST Framework** for Platform-Based Programming (PBP).

By executing the step-by-step milestones below, this template will become a fully functional RESTful application matching `bambangshop_api`.

---

## Hands-on Roadmap (see the last chapter in Module 8)

### Milestone 1: Define Models and Serialization
1. In `bambangshop_api/settings.py`, register `'rest_framework'`, `'rest_framework.authtoken'`, and `'catalog'` in `INSTALLED_APPS`.
2. In `catalog/models.py`, implement `Category` and `Product` models.
3. Run database migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
4. In `catalog/serializers.py`, implement `CategorySerializer` and `ProductSerializer`.

### Milestone 2: ViewSets, Permissions, and Routers
1. In `catalog/permissions.py`, implement `IsOwnerOrReadOnly` custom object-level permission.
2. In `catalog/views.py`, implement `CategoryViewSet` and `ProductViewSet` extending `ModelViewSet`.
3. In `catalog/urls.py`, configure `DefaultRouter` and register both viewsets under `/api/v1/`.

### Milestone 3: Filtering, Search, and OpenAPI / Swagger Integration
1. In `catalog/views.py`, add `DjangoFilterBackend`, `SearchFilter`, and `OrderingFilter` to `ProductViewSet`, and implement the `@action` restock endpoint.
2. In `bambangshop_api/settings.py`, register `'django_filters'` and `'drf_spectacular'` in `INSTALLED_APPS`, and configure `REST_FRAMEWORK` and `SPECTACULAR_SETTINGS`.
3. In `bambangshop_api/urls.py`, wire OpenAPI schema and Swagger UI endpoints (`/api/schema/`, `/api/docs/swagger/`, `/api/docs/redoc/`, `/api/v1/auth/token/`).

### Milestone 4: Integrating the Frontend with AJAX
1. Examine the modular frontend structure in `catalog/templates/catalog/product_list.html`, `catalog/templates/modals/`, and `catalog/static/catalog/`.
2. In `catalog/views.py`, implement `product_list_page` function view. Wire it at the root path in `catalog/urls.py` and include `catalog.urls` in `bambangshop_api/urls.py`.
3. In `catalog/static/catalog/js/product_list.js`, implement the client-side AJAX routines using the Fetch API with session authentication and `X-CSRFToken` protection.
4. Run the automated test suite to verify your implementation:
   ```bash
   python manage.py test
   ```

---

## Reflections

### Reflection Practice-1
1. *In ProductSerializer, why are owner and category_name configured with read_only=True via ReadOnlyField? What security vulnerability occurs if owner is writable?*
   - owner dan category_name dibuat read-only karena nilainya tidak boleh ditentukan oleh klien. owner diisi oleh server lewat perform_create() dari request.user, sedangkan category_name hanyalah nilai turunan dari category.name, bukan kolom yang bisa disimpan. Jika owner bisa ditulis, penyerang dapat mengirim username siapa pun di request body dan membuat atau mengubah produk atas nama pengguna lain (mass assignment / impersonation). Hal ini juga melemahkan IsOwnerOrReadOnly, karena kepemilikan produk bisa diubah sembarangan.

2. *Explain the execution order of field-level validation (validate_price) versus object-level validation (validate). When would you choose one over the other?*
   - Field-level validation (validate_price) dijalankan lebih dulu, terpisah untuk tiap field, setelah field tersebut lolos pengecekan tipe dan constraint bawaan. Object-level validation (validate) dijalankan setelahnya, satu kali, terhadap seluruh data field yang sudah bersih. Jika field-level validation gagal, validate() tidak dijalankan. Gunakan validate_<field> untuk aturan yang menyangkut satu field (misalnya price harus lebih dari 0). Gunakan validate() untuk aturan yang membandingkan beberapa field (misalnya tanggal mulai harus sebelum tanggal selesai).

### Reflection Practice-2
1. *When an anonymous user attempts to issue an HTTP DELETE request to `/api/v1/products/1/`, which permission check fails first? Explain the step-by-step evaluation between IsAuthenticatedOrReadOnly and IsOwnerOrReadOnly.*
   - IsAuthenticatedOrReadOnly gagal lebih dulu. DRF menjalankan check_permissions() (has_permission tiap class, berurutan) sebelum mengambil objek. Request DELETE bukan safe method dan pengguna anonim, sehingga hasilnya False dan request langsung ditolak dengan 401. IsOwnerOrReadOnly tidak pernah dievaluasi, karena pengecekannya (has_object_permission) baru berjalan di dalam get_object(), yang tidak tercapai.

2. *What actions does DefaultRouter generate automatically for ProductViewSet? List each URL path, supported HTTP method, and corresponding action method.*
   -  `DefaultRouter` membuat route berikut untuk `ProductViewSet`:

     | URL | HTTP method | Action method |
     |---|---|---|
     | `/api/v1/products/` | GET | `list` |
     | `/api/v1/products/` | POST | `create` |
     | `/api/v1/products/{id}/` | GET | `retrieve` |
     | `/api/v1/products/{id}/` | PUT | `update` |
     | `/api/v1/products/{id}/` | PATCH | `partial_update` |
     | `/api/v1/products/{id}/` | DELETE | `destroy` |
     | `/api/v1/products/{id}/restock/` | POST | `restock` (custom `@action`) |

     `DefaultRouter` juga menambahkan API root view di `/api/v1/`.

### Reflection Practice-3
1. *How does drf-spectacular automatically discover request and response schemas from your ViewSet and ModelSerializer classes?*
   - drf-spectacular melakukan introspeksi pada kode DRF saat endpoint /api/schema/ diminta. Ia membaca router untuk mendapatkan daftar URL dan HTTP method, lalu membaca serializer_class pada tiap ViewSet. Dari serializer, ia memetakan tiap field (tipe, required, read_only, max_length, validator) menjadi komponen JSON Schema. Serializer untuk request dan response bisa dibedakan, misalnya field read_only seperti owner hanya muncul di response. Informasi tambahan seperti filter, search, ordering, dan permission juga ikut terbaca, sedangkan @action seperti restock yang tidak bisa disimpulkan otomatis dapat dijelaskan lewat dekorator @extend_schema. Hasilnya adalah dokumen OpenAPI 3 yang selalu sinkron dengan kode, tanpa perlu ditulis manual.

2. *How does providing an interactive Swagger UI interface accelerate collaboration between backend engineers and frontend/mobile developers?*
   - Swagger UI menjadi dokumentasi hidup yang selalu sesuai dengan kode, sehingga frontend/mobile tahu persis endpoint, parameter, format request/response, dan kode error tanpa harus bertanya ke backend. Endpoint bisa langsung dicoba lewat tombol “Try it out”, jadi frontend bisa menguji dan memahami perilaku API walaupun UI-nya belum selesai. Skema OpenAPI juga bisa dipakai untuk men-generate client code dan data contoh (mock), sehingga kedua tim bisa bekerja paralel dan salah paham soal kontrak API berkurang.
### Reflection Practice-4
1. *Why is the X-CSRFToken header required for session-authenticated write requests (POST, PUT, DELETE) in Django REST Framework, but omitted for read requests (GET)?*
   - [Write your reflection answer here]

2. *Explain the architectural difference between token-based authentication (`Authorization: Token <key>`) and session-based authentication (`sessionid` cookie) when logging in and issuing API requests from client-side JavaScript.*
   - [Write your reflection answer here]

3. *Explain the security distinction between client-side HTML escaping (escapeHtml) and server-side serializer validation. Why are both mechanisms essential?*
   - [Write your reflection answer here]

4. *Why is event delegation on the grid container preferred over binding individual event listeners to each restock or delete button?*
   - [Write your reflection answer here]
