<form method="POST" action="{{ $action }}">
    @csrf
    @if ($product->exists)
        @method('PUT')
    @endif

    <div class="mb-3">
        <label class="form-label" for="name">Product name</label>
        <input
            class="form-control @error('name') is-invalid @enderror"
            id="name"
            name="name"
            type="text"
            value="{{ old('name', $product->name) }}"
            maxlength="255"
            required
            autofocus
        >
        @error('name')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>

    <div class="mb-3">
        <label class="form-label" for="category_id">Category</label>
        <select
            class="form-select @error('category_id') is-invalid @enderror"
            id="category_id"
            name="category_id"
            required
        >
            <option value="">Choose a category</option>
            @foreach ($categories as $category)
                <option
                    value="{{ $category->id }}"
                    @selected((string) old('category_id', $product->category_id) === (string) $category->id)
                >{{ $category->name }}</option>
            @endforeach
        </select>
        @error('category_id')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
        @if ($categories->isEmpty())
            <div class="form-text">Create a category before adding products.</div>
        @endif
    </div>

    <div class="mb-3">
        <label class="form-label" for="price">Price</label>
        <div class="input-group">
            <span class="input-group-text">$</span>
            <input
                class="form-control @error('price') is-invalid @enderror"
                id="price"
                name="price"
                type="number"
                value="{{ old('price', $product->price) }}"
                min="0"
                max="99999999.99"
                step="0.01"
                required
            >
            @error('price')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
    </div>

    <div class="mb-4">
        <label class="form-label" for="description">Description <span class="text-secondary fw-normal">(optional)</span></label>
        <textarea
            class="form-control @error('description') is-invalid @enderror"
            id="description"
            name="description"
            rows="4"
            maxlength="2000"
        >{{ old('description', $product->description) }}</textarea>
        @error('description')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>

    <div class="d-flex gap-2">
        <button class="btn btn-primary px-3" type="submit" @disabled($categories->isEmpty())>{{ $buttonText }}</button>
        <a class="btn btn-light border px-3" href="{{ route('web.products.index') }}">Cancel</a>
    </div>
</form>
