@extends('layouts.app')

@section('title', 'Edit product')
@section('heading', 'Products')

@section('content')
    <div class="mb-4">
        <h1 class="page-title">Edit product</h1>
        <p class="page-subtitle">Update {{ $product->name }}.</p>
    </div>
    <section class="panel">
        <div class="panel-body">
            @include('products.form', [
                'action' => route('web.products.update', $product),
                'buttonText' => 'Save changes',
            ])
        </div>
    </section>
@endsection
