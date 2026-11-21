@extends('layouts.app')

@section('title', 'Create product')
@section('heading', 'Products')

@section('content')
    <div class="mb-4">
        <h1 class="page-title">Create product</h1>
        <p class="page-subtitle">Add a product and assign it to a category.</p>
    </div>
    <section class="panel">
        <div class="panel-body">
            @include('products.form', [
                'action' => route('web.products.store'),
                'buttonText' => 'Create product',
            ])
        </div>
    </section>
@endsection
