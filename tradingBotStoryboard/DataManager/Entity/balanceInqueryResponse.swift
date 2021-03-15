//
//  balanceInqueryResponse.swift
//  tradingBotStoryboard
//
//  Created by 이동연 on 2021/02/23.
//

import Foundation
import ObjectMapper

struct balanceInqueryResponse {
    var code: Int!
    var message: String!
    //var tutorials: [Tutorial?]!
}

extension balanceInqueryResponse: Mappable {
    
    init?(map: Map) {
    }
    
    mutating func mapping(map: Map) {
        code <- map["code"]
        message <- map["message"]
        //tutorials <- map["result"]
    }
    
}

struct Balance {
    var seq: Int!
    var type: String!
    var url: String!
    var content: String!
}

extension Balance: Mappable {
    
    init?(map: Map) {
    }
    
    mutating func mapping(map: Map) {
        seq <- map["seq"]
        type <- map["type"]
        url <- map["url"]
        content <- map["content"]
    }
    
}
