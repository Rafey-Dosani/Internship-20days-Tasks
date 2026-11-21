@extends('layouts.app')

@section('title', 'Edit category')
@section('heading', 'Categories')

@section('content')
    <div class="mb-4">
        <h1 class="page-title">Edit category</h1>
        <p class="page-subtitle">Update {{ $category->name }}.</p>
    </div>
    <section class="panel">
        <div class="panel-body">
            @include('categories.form', [
                'action' => route('web.categories.update', $category),
                'buttonText' => 'Save changes',
            ])
        </div>
    </section>
@endsection
