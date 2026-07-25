<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice #{{ $booking->reference }}</title>
    <style>
        @page { margin: 20px; }
        body { font-family: Arial, Helvetica, sans-serif; color: #000000; font-size: 10px; line-height: 1.2; margin: 0; padding: 10px; }
        table { width: 100%; border-collapse: collapse; }
        .header-logo { font-size: 20px; font-weight: bold; color: #8b5cf6; text-transform: uppercase; letter-spacing: 2px; }
        .header-title { font-size: 26px; font-weight: bold; text-align: right; margin: 0; color: #1e1b4b; }
        .boxed-table { border: 1.5px solid #000000; margin-top: 10px; }
        .boxed-table td, .boxed-table th { border: 1px solid #000000; padding: 5px 8px; }
        .boxed-header { font-weight: bold; text-transform: uppercase; background: #faf5ff; }
        .items-table { border: 1.5px solid #000000; margin-top: 15px; }
        .items-table th { border: 1px solid #000000; padding: 6px 8px; font-size: 11px; font-weight: bold; text-align: center; background: #faf5ff; }
        .items-table td { border-left: 1px solid #000000; border-right: 1px solid #000000; border-bottom: 1px solid #e0e0e0; padding: 8px 8px; font-size: 10px; }
        .items-table tr.item-row { height: 35px; }
        .items-table tr.empty-row { height: 160px; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .totals-table { border: 1.5px solid #000000; }
        .totals-table td { border: 1px solid #000000; padding: 5px 8px; font-size: 10px; }
        .totals-table .label-col { font-weight: bold; }
        .totals-table .amount-col { text-align: right; font-weight: bold; }
        .disclaimer-cell { border: 1.5px solid #000000; padding: 8px 10px; font-size: 9px; text-align: center; line-height: 1.3; }
        .footer-table { border: 1.5px solid #000000; margin-top: 15px; }
        .footer-table td { border: 1px solid #000000; padding: 5px 8px; font-size: 9px; }
        .footer-table .title-col { font-weight: bold; font-size: 9px; text-transform: uppercase; }
    </style>
</head>
<body>

    @php
        $event = $booking->event;
        $teaOrders = $booking->teaOrders ?? $booking->tea_orders ?? collect([]);
        $eventPrice = (float)($booking->total_price ?? 0);
        $drinksTotal = 0;
        foreach ($teaOrders as $ord) {
            $drinksTotal += (float)($ord->unit_price * $ord->quantity);
        }
        $subtotal = $eventPrice + $drinksTotal;
        $taxRate = (float)($booking->tax_rate ?? 0);
        $taxAmount = $taxRate > 0 ? ($subtotal * ($taxRate / 100)) : 0;
        $grandTotal = $subtotal + $taxAmount;
    @endphp

    {{-- FIRST SECTION: Header Info --}}
    <table>
        <tr>
            <td width="55%" style="vertical-align: top;">
                @if(file_exists(public_path('logo.png')))
                    <img src="{{ public_path('logo.png') }}" style="max-height: 75px; margin-bottom: 5px;">
                @endif
                <div style="font-size: 9px; color: #333; margin-top: 4px;">
                    Sip. Stretch. Glow.<br>
                    hello@pilatea.com
                </div>
            </td>
            <td width="45%" style="vertical-align: top;">
                <div class="header-title">Invoice</div>
                <table class="boxed-table" style="margin-top: 10px;">
                    <tr class="boxed-header text-center">
                        <td width="50%">Date</td>
                        <td width="50%">Booking #</td>
                    </tr>
                    <tr class="text-center">
                        <td>{{ $booking->created_at ? $booking->created_at->format('Y-m-d') : date('Y-m-d') }}</td>
                        <td>{{ $booking->reference }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    {{-- SECOND SECTION: Invoice To & Terms --}}
    <table style="margin-top: 15px;">
        <tr>
            <td width="55%" style="vertical-align: top; padding-right: 15px;">
                <table class="boxed-table" style="margin-top: 0;">
                    <tr class="boxed-header">
                        <td>Invoice To</td>
                    </tr>
                    <tr style="height: 55px; vertical-align: top;">
                        <td>
                            <strong>{{ strtoupper($booking->name ?? 'Attendee') }}</strong><br>
                            Email: {{ $booking->email }}<br>
                            @if(!empty($booking->phone)) Phone: {{ $booking->phone }} @endif
                        </td>
                    </tr>
                </table>
            </td>
            <td width="45%" style="vertical-align: top;">
                <table class="boxed-table" style="margin-top: 0;">
                    <tr class="boxed-header text-center">
                        <td>Payment Method</td>
                    </tr>
                    <tr class="text-center" style="height: 55px; vertical-align: middle;">
                        <td>{{ $booking->payment_method === 'pay_on_arrival' ? 'Pay on Arrival' : ucfirst($booking->payment_method ?? 'Card/Online') }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    {{-- THIRD SECTION: Items Table --}}
    <table class="items-table">
        <thead>
            <tr>
                <th width="55%">Description</th>
                <th width="15%">Quantity</th>
                <th width="15%">Price Each</th>
                <th width="15%">Amount</th>
            </tr>
        </thead>
        <tbody>
            {{-- Event Attendance Line --}}
            <tr class="item-row">
                <td style="vertical-align: top;">
                    <strong>Event Attendance: {{ $event ? $event->title : 'Wellness Event Session' }}</strong>
                </td>
                <td class="text-center" style="vertical-align: top;">{{ $booking->spots_booked }}</td>
                <td class="text-right" style="vertical-align: top;">${{ number_format($booking->spots_booked > 0 ? $eventPrice / $booking->spots_booked : $eventPrice, 2) }}</td>
                <td class="text-right" style="vertical-align: top;">${{ number_format($eventPrice, 2) }}</td>
            </tr>

            {{-- Drink / Tea Orders Line Items --}}
            @foreach($teaOrders as $ord)
            @php
                $teaName = ($ord->teaItem || $ord->tea_item)?->name ?? 'Specialty Tea / Beverage';
                $itemTotal = (float)($ord->unit_price * $ord->quantity);
            @endphp
            <tr class="item-row">
                <td style="vertical-align: top;">
                    Beverage: {{ $teaName }} @if(!empty($ord->notes)) ({{ $ord->notes }}) @endif
                </td>
                <td class="text-center" style="vertical-align: top;">{{ $ord->quantity }}</td>
                <td class="text-right" style="vertical-align: top;">${{ number_format($ord->unit_price, 2) }}</td>
                <td class="text-right" style="vertical-align: top;">${{ number_format($itemTotal, 2) }}</td>
            </tr>
            @endforeach

            {{-- Empty row to stretch box --}}
            <tr class="empty-row">
                <td style="border-bottom: none;"></td>
                <td style="border-bottom: none;"></td>
                <td style="border-bottom: none;"></td>
                <td style="border-bottom: none;"></td>
            </tr>
        </tbody>
    </table>

    {{-- FOURTH SECTION: Disclaimer + Totals Box --}}
    <table style="margin-top: -1px;">
        <tr>
            <td width="60%" class="disclaimer-cell" style="vertical-align: top;">
                Thank you for joining PilaTea Wellness Studio!<br>
                Sip. Stretch. Glow.<br>
                <strong>We hope you enjoyed your session and refreshments!</strong>
            </td>
            <td width="40%" style="vertical-align: top;">
                <table class="totals-table" style="width: 100%;">
                    <tr>
                        <td class="label-col" width="50%">Subtotal</td>
                        <td class="amount-col" width="50%">${{ number_format($subtotal, 2) }}</td>
                    </tr>
                    @if($taxRate > 0)
                    <tr>
                        <td class="label-col">Sales Tax ({{ number_format($taxRate, 2) }}%)</td>
                        <td class="amount-col">${{ number_format($taxAmount, 2) }}</td>
                    </tr>
                    @endif
                    <tr style="background: #faf5ff;">
                        <td class="label-col">Total Amount</td>
                        <td class="amount-col">${{ number_format($grandTotal, 2) }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    {{-- FIFTH SECTION: Footer info --}}
    <table class="footer-table">
        <tr>
            <td width="33%">
                <div class="title-col">STUDIO CONTACT</div>
                <div>hello@pilatea.com</div>
            </td>
            <td width="34%">
                <div class="title-col">BOOKING STATUS</div>
                <div>{{ strtoupper($booking->payment_status ?? 'Confirmed') }}</div>
            </td>
            <td width="33%" style="background: #faf5ff;">
                <div class="title-col" style="font-size: 10px;">TOTAL CHARGED</div>
                <div style="font-size: 13px; font-weight: bold; color: #5b21b6;">${{ number_format($grandTotal, 2) }}</div>
            </td>
        </tr>
    </table>

</body>
</html>
