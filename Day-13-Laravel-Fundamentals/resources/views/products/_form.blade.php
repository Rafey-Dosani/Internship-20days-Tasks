<form
    class="product-form"
    method="POST"
    action="{{ $product->exists ? route('products.update', $product) : route('products.store') }}"
>
    @csrf
    @if ($product->exists)
        @method('PUT')
    @endif

    <div class="form-grid">
        <div class="form-field form-field-full">
            <label for="name">Product name <span class="required-mark">*</span></label>
            <input id="name" name="name" type="text" value="{{ old('name', $product->name) }}" maxlength="255" required autofocus aria-describedby="name-error">
            @error('name')
                <span class="field-error" id="name-error">{{ $message }}</span>
            @enderror
        </div>

        <div class="form-field form-field-full">
            <label for="description">Description</label>
            <textarea id="description" name="description" rows="4" aria-describedby="description-error">{{ old('description', $product->description) }}</textarea>
            @error('description')
                <span class="field-error" id="description-error">{{ $message }}</span>
            @enderror
        </div>

        <div class="form-field">
            <label for="price">Price <span class="required-mark">*</span></label>
            <div class="input-with-prefix">
                <span aria-hidden="true">$</span>
                <input id="price" name="price" type="number" value="{{ old('price', $product->price) }}" min="0" max="99999999.99" step="0.01" required aria-describedby="price-error">
            </div>
            @error('price')
                <span class="field-error" id="price-error">{{ $message }}</span>
            @enderror
        </div>

        <div class="form-field">
            <label for="quantity">Quantity <span class="required-mark">*</span></label>
            <input id="quantity" name="quantity" type="number" value="{{ old('quantity', $product->quantity) }}" min="0" step="1" required aria-describedby="quantity-error">
            @error('quantity')
                <span class="field-error" id="quantity-error">{{ $message }}</span>
            @enderror
        </div>
    </div>

    <div class="form-actions">
        <a class="button button-secondary" href="{{ route('products.index') }}">Cancel</a>
        <button class="button button-primary" type="submit">{{ $product->exists ? 'Save changes' : 'Create product' }}</button>
    </div>
</form>
