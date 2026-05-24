<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            // Si ya existe user_id, no la agregues de nuevo
            if (!Schema::hasColumn('orders', 'user_id')) {
                $table->foreignId('user_id')->constrained()->after('id');
            }
            if (!Schema::hasColumn('orders', 'order_number')) {
                $table->string('order_number')->unique()->after('user_id');
            }
            if (!Schema::hasColumn('orders', 'total')) {
                $table->decimal('total', 10, 2)->after('order_number');
            }
            if (!Schema::hasColumn('orders', 'status')) {
                $table->string('status')->default('pendiente')->after('total');
            }
            if (!Schema::hasColumn('orders', 'payment_method')) {
                $table->string('payment_method')->nullable()->after('status');
            }
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'order_number', 'total', 'status', 'payment_method']);
        });
    }
};
