//
//  ContentView.swift
//  tradingBotApp
//
//  Created by 이동연 on 2021/02/23.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Text("Wecome, Bily Club!")
                .font(.footnote)
                .fontWeight(.bold)
                .frame(width: 130.0, height: 200.0)
            Button(action: /*@START_MENU_TOKEN@*//*@PLACEHOLDER=Action@*/{}/*@END_MENU_TOKEN@*/) {
                Text("자산 조회")
                    .font(.footnote)
                    .fontWeight(.bold)
        
            }
        }
            
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            ContentView()
            ContentView()
        }
    }
}
