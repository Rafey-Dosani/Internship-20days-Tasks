<form method="POST" action="{{ $action }}">
    @csrf
    @if ($category->exists)
        @method('PUT')
    @endif

    <div class="mb-3">
        <label class="form-label" for="name">Name</label>
        <input
            class="form-control @error('name') is-invalid @enderror"
            id="name"
            name="name"
            type="text"
            value="{{ old('name', $category->name) }}"
            maxlength="255"
            required
            autofocus
        >
        @error('name')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>

    <div class="mb-4">
        <label class="form-label" for="description">Description <span class="text-secondary fw-normal">(optional)</span></label>
        <textarea
            class="form-control @error('description') is-invalid @enderror"
            id="description"
            name="description"
            rows="4"
            maxlength="2000"
        >{{ old('description', $category->description) }}</textarea>
        @error('description')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>

    <div class="d-flex gap-2">
        <button class="btn btn-primary px-3" type="submit">{{ $buttonText }}</button>
        <a class="btn btn-light border px-3" href="{{ route('web.categories.index') }}">Cancel</a>
    </div>
</form>
