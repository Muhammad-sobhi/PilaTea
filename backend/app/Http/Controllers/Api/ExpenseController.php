<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index()
    {
        return response()->json(
            Expense::with('createdBy')->orderBy('expense_date', 'desc')->get()
        );
    }

    public function show($id)
    {
        return response()->json(Expense::with('createdBy')->findOrFail($id));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|in:material,services',
            'description' => 'nullable|string',
            'expense_date' => 'required|date',
            'receipt' => 'nullable|string',
        ]);

        $data['created_by'] = $request->user()?->id;

        return response()->json(Expense::create($data), 201);
    }

    public function update(Request $request, $id)
    {
        $expense = Expense::findOrFail($id);
        $data = $request->validate([
            'title' => 'string|max:255',
            'amount' => 'numeric|min:0',
            'category' => 'in:material,services',
            'description' => 'nullable|string',
            'expense_date' => 'date',
            'receipt' => 'nullable|string',
        ]);

        $expense->update($data);
        return response()->json($expense);
    }

    public function destroy($id)
    {
        Expense::findOrFail($id)->delete();
        return response()->json(['message' => 'Expense deleted']);
    }
}
