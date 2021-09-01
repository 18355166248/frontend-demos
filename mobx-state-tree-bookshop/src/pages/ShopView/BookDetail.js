import React from "react";
import { inject, observer } from "mobx-react";

const BookDetail = inject("shop")(observer(({ shop }) => <div>书籍详情</div>));

export default BookDetail;
