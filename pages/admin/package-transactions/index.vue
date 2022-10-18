<template>
    <!-- Page-content -->
    <index-view>
        <template #title> {{ $t("packageTransaction.title.manage") }} </template>
        <!-- List Header -->
        <template #header>
            <search-control :placeholder="$t('placeholder.search')" v-model="filters.search"></search-control>

            <!-- Download -->
            <b-dropdown variant="info" right text="Download">
                <b-dropdown-item @click="downloadPdf">Download PDF</b-dropdown-item>
                <b-dropdown-item @click="downloadExcel">Download Excel</b-dropdown-item>
            </b-dropdown>
        </template>

        <template>
            <data-table @onCheck="handleCheck" :columns="columns" url="/admin/package-payments" :filters="filters">
                <!-- Action Slot -->
                <template v-slot:action="{  }">
                    <!-- <action-dropdown>                        
                        <b-dropdown-item :to="localePath(`/admin/package-transaction/${row.id}`)">
                            <i class="far mr-1 fa-share-square text-success"></i>
                            Details
                        </b-dropdown-item>
                    </action-dropdown> -->
                </template>

                <!-- Status Column -->
                <template v-slot:method="{ col }">
                    {{col | capitalize}}
                </template>
                <!-- Filter slot -->
                <template #filter>
                    <page-filter v-model="filters.perPage"></page-filter>

                </template>
            </data-table>
        </template>
    </index-view>
    <!-- End Page-content -->
</template>

<script>
export default {
    layout: 'admin',
    data() {
        return {
            columns: [
                { label: 'clientName', field: 'client.name' },
                { label: 'shopName', field: 'client.shopName' },
                { label: 'date', field: 'createdAtFormatted' },
                { label: 'package', field: 'package.name' },
                'method',
                'amount',
                { label: 'type', field: 'subscriptionType' },
            ],
            filters: {
                search: "",
                perPage: 25,
            },
            checkedList: [],
        }
    },

    methods: {
        handleCheck(value) {
            this.checkedList = value
        },
        getDownloadUrl(name) {
            const url = `/admin/package-payments/${name}?sort=id,des`
            if (this.checkedList.length) {
                return `${url}&ids=${this.checkedList}`
            } else {
                return `${url}${this.getQueries(this.filters)}`
            }
        },
        downloadPdf() {
            this.fileDownload({
                url: this.getDownloadUrl("pdf"),
                fileType: "application/pdf",
                fileName: "package-transaction.pdf",
            })
        },
        downloadExcel() {
            this.fileDownload({
                url: this.getDownloadUrl("excel"),
                fileType: "application/vnd.ms-excel",
                fileName: "package-transaction.xlsx",
            })
        },
    },
}
</script>

<style lang="scss" scoped>
</style>