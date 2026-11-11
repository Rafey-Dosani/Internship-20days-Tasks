@extends('layouts.app')

@section('title', 'Add product')

@section('content')
    <section class="page-heading">
        <div>
            <p class="eyebrow">Inventory management</p>
            <h1>Add a product</h1>
            <p class="page-description">Enter the details for the new item in your catalog.</p>
        </div>
        <a class="button button-secondary" href="{{ route('products.index') }}">Back to products</a>
    </section>

    <section class="panel form-panel">
        <div class="panel-heading">
            <div>
                <h2>Product details</h2>
                <p>Fields marked with <span class="required-mark">*</span> are required.</p>
            </div>
        </div>
        @include('products._form')
    </section>
@endsection
